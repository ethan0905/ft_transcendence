import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async createUser(
		email: string,
		username: string,
		// hash: string,
		id = 0,
	) {
		const user = await this.prisma.user.create({
			data: {
				email,
				username,
				// hash,
				// id42: id,
			},
		});

		// delete user.hash;
		return user;
	}

	async editUser(userId: number, dto: EditUserDto) {
		const user = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...dto,
			},
		});

		// delete user.hash;
		return user;
	}

	async getUser(User: string) {
		return this.prisma.user.findUnique({
			where: {
				username: User,
			},
		});
	}

	async getUserbyId(Id :number) {
		return this.prisma.user.findUnique({
			where: {
				id: Id,
			},
		});
	}

	async getUsername(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				username: true,
			},
		});
	}

	async editUsername(@Req() req: Request) {
		return this.prisma.user.update({
			where: {
				accessToken: req.headers.authorization,
			},
			data: {
				username: req.body.username,
			},
		});
	}

	async getAvatar(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				avatarUrl: true,
			},
		});
	}

	async uploadAvatar(@UploadedFile() file, @Req() req: Request) {

		console.log("upload function back : file : ", file);
		console.log("upload function back : location : ", file.location);
		console.log("upload function back : path : ", file.path);

		return this.prisma.user.update({
			where: {
				accessToken: req.body.authorization,
			},
			data: {
				avatarUrl: file.location,
			},
		});
	}
}
