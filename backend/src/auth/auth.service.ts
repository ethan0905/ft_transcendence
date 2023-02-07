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
	
	signin() {
		return {msg: 'I have signed in!'};
	}
}