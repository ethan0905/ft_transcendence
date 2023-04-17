import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { FriendDto, GetFriendDTO } from './dto/friend.dto'

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


	async getmail(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				email: true,
			},
		});
	}

	async getid(@Req() req: Request) {
		return this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				id: true,
			},
		});
	}

	async addfriend(data : FriendDto)
	{
		console.log("data: ", data)
		const userid = await this.prisma.user.findUnique({
			where: { username: data.username},
			select: { id: true }
		})
		console.log("userid: ", userid.id)
		const friendid = await this.prisma.user.findUnique({
			where: { accessToken: data.Tokensource},
			select: { friends: true}
		})
		friendid.friends.push(userid.id);
		console.log("fiendid: ", friendid.friends);
		await this.prisma.user.update({
			where: { accessToken: data.Tokensource},
			data: { friends: {set: friendid.friends}}
		})
	}

	async getfriend(data : GetFriendDTO)
	{
		const user = this.prisma.user.findUnique({
			where: { accessToken: data.Tokensource},
			select: { friends: true }
		})
		return (user)
	}
}
