/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, Auth42Dto } from './dto';
// import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Body } from '@nestjs/common';

@Injectable()
export class AuthService{
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

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

	async afterRedirection() {

		console.log("Redirection happened! Now what?");
	}

	async accessToken(req: string) {

		try {
		  const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `grant_type=authorization_code&client_id=${process.env.API42_CLIENT_ID}&client_secret=${process.env.API42_CLIENT_SECRET}&code=${req}&redirect_uri=${process.env.API42_REDIRECT_URI}`,
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

	async create42User(token: any, user42: any) {
		try {
			console.log("Creating user... \n");	

			// if (user42.email)
			// 	return user42;

			const user = await this.prisma.user.create({
				data: {
					email: user42.email,
					username: user42.login,
					accessToken: token.access_token,
					refreshToken: token.refresh_token,
					twoFactorAuth: false,
					twoFactorActivated: false,
					// hash: token, //while we don't have a password
				},
			});
	
			console.log("Create42User()\n");

			return user;
		}catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			// throw new HttpException(
			// 	{
			// 	  status: HttpStatus.BAD_REQUEST,
			// 	  error: "Error while creating user in the database"
			// 	}, HttpStatus.BAD_REQUEST); 
		};
	}

	async findUserByEmail(user42: any) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					email: user42.email,
				},
			});
			return user;
		} catch (error) {
			throw new HttpException(
				{

				status: HttpStatus.BAD_REQUEST,
				error: "Error while finding user in the database"
				}, HttpStatus.BAD_REQUEST);
		};
	}

	async createCookies(@Res() res: Response, token: any) {
		// console.log("Creating cookies with: [" + token.access_token + "]\n");
		const cookies = res.cookie("token", token.access_token,
		{
		  expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
		//   httpOnly: true, // for security
		  httpOnly: false, // for security
		});
		// const Googlecookies = res.cookie("FullToken", token,
		// {
		//   expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
		//   httpOnly: true, // for security
		// });
	}


	async updateCookies(@Res() res: Response, token: any, user42: any) {
		try {
		  if (user42)
		  {
			const user = await this.prisma.user.update({
				where: {
				username: user42.login,
			},
				data: {
					accessToken: token.access_token,
				},
			});
			return user;
		  }
		  else
			return (null);
		} catch (error)
		{
			throw new HttpException({
			status: HttpStatus.BAD_REQUEST,
			error: "Error to update the cookes"},
			HttpStatus.BAD_REQUEST);
		}
	}

	async deleteCookies(@Res() res: Response) {
		res.clearCookie("token");
	}

	async get2FAStatus(@Req() req: Request) {
		try {
			// console.log("123123 req: [", req.headers.authorization);
			
			const status = await this.prisma.user.findFirst({
				where: {
					accessToken: req.headers.authorization,
				},
				select: {
					twoFactorAuth: true,
					twoFactorActivated: true,
				},
			});

			// console.log("123123 status: [", status);
			return status;
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Error to get the 2FA status"},
				HttpStatus.BAD_REQUEST);
		}
	}

	async enable2FA(@Req() req: Request, @Res() res: Response) {

		// console.log("Getting my Token from req.body.twoFactorAuth: ", req.body.twoFactorAuth);
		// console.log("Getting my Token from req.cookies.token: ", req.body.token);

		const user = await this.prisma.user.update({
			where: {
				accessToken: req.body.token,
			},
			data: {
				twoFactorAuth: req.body.twoFactorAuth,
			},
		});

		// console.log("2fa has been SWITCHED! status: ", req.body.twoFactorAuth);

		// if (req.body.twoFactorAuth == true)
		// {
		// 	// if (user.twoFactorSecret == null)
		// 	// {
		// 		// if (user.twoFactorSecret != null)
		// 		// 	return {message: "2FA already enabled"};

		// 		const secret = authenticator.generateSecret();
		// 		await this.prisma.user.update({
		// 			where: {
		// 				accessToken: req.body.token,
		// 			},
		// 			data: {
		// 				twoFactorSecret: secret,
		// 			},
		// 		});

		// 		const twoFactorSecret = await this.prisma.user.findFirst({
		// 			where: {
		// 				accessToken: req.body.token,
		// 			},
		// 			select: {
		// 				twoFactorSecret: true,
		// 			},
		// 		});

		// 		console.log("User.twofactorsecret : ", twoFactorSecret.twoFactorSecret);

		// 		if (twoFactorSecret.twoFactorSecret == null)
		// 			return {message: "Error while enabling 2FA"};

		// 		const otpauthUrl = authenticator.keyuri(user.email, 'Pong Pong', twoFactorSecret.twoFactorSecret);
		// 		console.log("otpauthUrl: ", otpauthUrl);

		// 		return res.json(
		// 			await this.generateQrCodeDataURL(otpauthUrl)
		// 		);
		// 	// }
		// 	// const middleIndex = Math.floor(secret.length / 8);
		// 	// const firstQuarter = secret.substr(0, middleIndex);
		// 	// console.log("Secret: ", secret);


		// 	// const speakeasy = require('speakeasy');

		// 	// const otpauthUrl = speakeasy.otpauthURL({
		// 	// 	secret: secret,
		// 	// 	label: 'Pong ping',
		// 	// 	algorithm: 'sha512',
		// 	// 	encoding: 'base32'
		// 	// });
		// 	// console.log("otpauthUrl: ", otpauthUrl);

		// 	// console.log(otpauthUrl);


		// 	// await this.prisma.user.update({
		// 	// 	where: {
		// 	// 		accessToken: req.body.token,
		// 	// 	},
		// 	// 	data: {
		// 	// 		twoFactorSecret: secret,
		// 	// 	},
		// 	// });

		// 	// const qrCodeDataURL = await this.generateQrCodeDataURL(otpauthUrl);
		// 	// console.log("qrCodeDataURL: ", qrCodeDataURL);

		// 	// return qrCodeDataURL;
		// }
	}

	async activate2FA(@Req() req: Request, @Res() res: Response) {

		console.log("99998888---> ", req.body.twoFactorActivated);
		// console.log("Getting my Token from req.cookies.token: ", req.body.token);

		const user = await this.prisma.user.update({
			where: {
				accessToken: req.body.token,
			},
			data: {
				twoFactorActivated: req.body.twoFactorActivated,
			},
		});
	}

	// async disable2FA(@Req() req: Request, @Res() res: Response) {

	// 	await this.prisma.user.update({
	// 		where: {
	// 			accessToken: req.body.token,
	// 		},
	// 		data: {
	// 			twoFactorAuth: false,
	// 		},
	// 	});

	// 	console.log("Two factor Boolean has been disabled!");
	// }

	async generate2FA(@Req() req: Request, @Res() res: Response) {
		
		const user = await this.prisma.user.findFirst({
			where: {
				accessToken: req.body.token,
			},
		});

		if (user.twoFactorAuth == true)
		{
			const secret = authenticator.generateSecret();
			await this.prisma.user.update({
				where: {
					accessToken: req.body.token,
				},
				data: {
					twoFactorSecret: secret,
				},
			});

			const twoFactorSecret = await this.prisma.user.findFirst({
				where: {
					accessToken: req.body.token,
				},
				select: {
					twoFactorSecret: true,
				},
			});

			// console.log("User.twofactorsecret : ", twoFactorSecret.twoFactorSecret);

			if (twoFactorSecret.twoFactorSecret == null)
				return {message: "Error while enabling 2FA"};

			const otpauthUrl = authenticator.keyuri(user.email, 'Pong Pong', twoFactorSecret.twoFactorSecret);
			// console.log("otpauthUrl: ", otpauthUrl);

			return res.json(
				await this.generateQrCodeDataURL(otpauthUrl)
			);
		}
	}

	async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
		return toDataURL(otpAuthUrl);
	}

	async verify2FA(@Req() req: Request) {
		
		const user = await this.prisma.user.findFirst({
			where: {
				accessToken: req.body.token,
			},
		});

		console.log("user to verify:  ", user.email);
		console.log("authenticator code to verify:  ", req.body.twoFACode);

		return authenticator.verify({
		  token: req.body.twoFACode, // the code the user enters
		  secret: user.twoFactorSecret,
		});
	  }

	  async checkIfUserAuthenticated(@Req() req: Request) {
		  
		console.log("Is user authenticated ? ", req.headers.authorization);
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					accessToken: req.headers.authorization,
				},
			});
			console.log("User found: ", user.email);
			return user;
		} catch (error) {
			console.log(error);
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		// return userEmail || null;
	  }
}