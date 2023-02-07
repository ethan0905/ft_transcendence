import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService{
	constructor(private prisma: PrismaService) {}
	async signup(dto: AuthDto) {
		//1. generate the password hash
		const hash = await argon.hash(dto.password);
		//2. save user in the database

		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,
				},
			});
	
			delete user.hash;
			//3. return the saved user
			return user;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException(
						'Credential taken',
					);
			}
			throw error;
		}
	}
	
	async signin(dto: AuthDto) {
		//1. find the user by email
		const user = await this.prisma.user.findUnique({
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
		delete user.hash;
		return user;
	}
}