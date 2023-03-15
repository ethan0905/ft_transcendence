/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, Auth42Dto } from './dto';
// import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { HttpCode, HttpStatus, HttpException } from '@nestjs/common';

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
		// const pwMatches = await argon.verify(user.hash, dto.password);
		//if password incorrect, throw exception
		// if (!pwMatches)
		// 	throw new ForbiddenException('Credentials incorrect');

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
			return user;
		}
		else
			return user;
	}

	async create42User(dto: Auth42Dto) {
		// const { id, email, username, avatar } = dto;

		// //generate a random password
		// const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		
		// //1. generate the password hash
		// // const hash = await argon.hash(randomPassword);

		// //2. save user in the database
		// const user = await this.userService.createUser(
		// 	email,
		// 	username,
		// 	hash,
		// 	id,
		// );

		// console.log(user);

		// //3. return the saved user
		// return user;
    return {
			message: 'User created'
    };
	}

	async afterRedirection() {

		console.log("Redirection happened! Now what?");

		// retrieve the code from the url
		// const token = await this.accessToken()

		// return ({
		// });
	}

	// async getToken(@Req() req: Request, @Res() res: Response) {

	// 	// const code = req.query.code as string;
	// 	// console.log("req.query.code = " + code);

	// 	// const token = await this.accessToken(code);
	// 	// console.log("this.accessToken = " + token);

	// 	return;
	// 	// res.redirect(`http://localhost:3000/?token=${token.access_token}`)
	// }

	async accessToken(req: string) {

		try {
		  const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `grant_type=authorization_code&client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&client_secret=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&code=${req}&redirect_uri=http://localhost:3333/auth/42/callback`,
		  });
		  const data = await response.json();
		  
		  if (!data)
		  {
			throw new HttpException(
			  {
				status: HttpStatus.BAD_REQUEST,
				error: "Empty token"
			  },
			   HttpStatus.BAD_REQUEST); 
			};
		  return data;
		} catch (error) {
		  throw new HttpException(
			{
			  status: HttpStatus.BAD_REQUEST,
			  error: "Error while getting the user with token"},
			 HttpStatus.BAD_REQUEST); 
			};
		}

		async get42User(accessToken: string) {

			try {
			  const response = await fetch("https://api.intra.42.fr/v2/me", {
				method: "GET",
				headers: { Authorization: `Bearer ${accessToken}` },
			  });
			  if (!response.ok) {
				throw new HttpException(
				  {
					status: HttpStatus.BAD_REQUEST,
					error: "Empty 42 user datas"
				  },
				   HttpStatus.BAD_REQUEST); 
			  }
			  const data = await response.json();
			  return data;
			} catch (error) {
			  throw new ForbiddenException("Invalid token");
			}
		  }
}