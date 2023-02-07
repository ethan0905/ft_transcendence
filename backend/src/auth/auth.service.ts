import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService{
	constructor(private prisma: PrismaService) {}
	async signup(dto: AuthDto) {
		//1. generate the password hash
		const hash = await argon.hash(dto.password);
		//2. save user in the database
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash,
			},
		});
		//3. return the saved user
		return user;
	}
	
	signin() {
		return {msg: 'I have signed in!'};
	}
}