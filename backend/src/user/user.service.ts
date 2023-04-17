import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUser(User: string) {
		return this.prisma.user.findUnique({
			where: {
				username: User,
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

	async getEmail(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				email: true,
			},
		});
	}

	async getId(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				id: true,
			},
		});
	}

	async getUserNameById(@Req() req: Request) {

		console.log("GET USER BY id: ", req.headers.id);

		const value = parseInt(req.headers.id as string, 10);

		// return {message: "hello"};
		return this.prisma.user.findUnique({
			where: {
				id: value,
			},
			select: {
				username: true,
			},
		});
	}

	// async addfriend(data : FriendDto)
	// {
	// 	console.log("data: ", data)
	// 	const userid = await this.prisma.user.findUnique({
	// 		where: { username: data.username},
	// 		select: { id: true }
	// 	})
	// 	console.log("userid: ", userid.id)
	// 	const friendid = await this.prisma.user.findUnique({
	// 		where: { accessToken: data.Tokensource},
	// 		select: { friends: true}
	// 	})
	// 	friendid.friends.push(userid.id);
	// 	console.log("fiendid: ", friendid.friends);
	// 	await this.prisma.user.update({
	// 		where: { accessToken: data.Tokensource},
	// 		data: { friends: {set: friendid.friends}}
	// 	})
	// }

	// async getfriend(data : GetFriendDTO)
	// {
	// 	const user = this.prisma.user.findUnique({
	// 		where: { accessToken: data.Tokensource},
	// 		select: { friends: true }
	// 	})
	// 	return (user)
	// }

}
