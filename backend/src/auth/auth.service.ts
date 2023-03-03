import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, Auth42Dto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService{
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	// async signup(dto: AuthDto) {
	// 	//1. generate the password hash
	// 	const hash = await argon.hash(dto.password);
	// 	//2. save user in the database

	// 	try {
	// 		const user = await this.prisma.user.create({
	// 			data: {
	// 				email: dto.email,
	// 				hash,
	// 			},
	// 		});
	// 		 //3. return the saved user (signed token)
	// 		return this.signToken(user.id, user.email);
	// 	} catch(error) {
	// 		if (error instanceof PrismaClientKnownRequestError) {
	// 			if (error.code === 'P2002')
	// 				throw new ForbiddenException(
	// 					'Credential taken',
	// 				);
	// 		}
	// 		throw error;
	// 	}
	// }
	
	async signin(dto: AuthDto) {
		//1. find the user by email
		const user = await this.prisma.user.findFirstOrThrow({
			where: {
				email: dto.email, 
			},
		});
		//if user does not exist, throw exception
		if (!user)
			throw new ForbiddenException('Credentials incorrect');

		//2. compare password
		const pwMatches = await argon.verify(user.hash, dto.password);
		//if password incorrect, throw exception
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');

		//3. send back the user
		return this.signToken(user.id, user.email);
	}

	async signToken(userId: number, email: string): Promise<{access_token: string}> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.signAsync(
			payload, {
				expiresIn: '15min',
				secret: secret,
			},
		);

		return {
			access_token: token,
		};
	}

	testAuth() {
		return ({
			message: '/auth path is working!'
		});
	}

	async signin42(dto: Auth42Dto) {
		//1. find the user by id42
		const user = this.prisma.user.findFirst({
			where: {
				id: dto.id,
			},
		});

		//if user does not exist, create it
		if (!user) {
			this.create42User(dto);
		}
	}

	async create42User(dto: Auth42Dto) {
		const { id, email, username, avatar } = dto;

		//generate a random password
		const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		
		//1. generate the password hash
		const hash = await argon.hash(randomPassword);

		//2. save user in the database
		const user = await this.userService.createUser({
			data: {
				email,
				username,
				hash,
				id,
			},
		});

		email: string,
		username: string,
		hash: string,
		id = 0,
		//3. return the saved user
		return user;
	}
}