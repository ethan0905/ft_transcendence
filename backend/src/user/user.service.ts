import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { FriendDto } from './dto/friend.dto';
import { GetFriendDTO } from './dto/friend.dto';

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

		const value = parseInt(req.headers.id as string, 10);

		return this.prisma.user.findUnique({
			where: {
				id: value,
			},
			select: {
				username: true,
			},
		});
	}

	async addFriend(data : FriendDto)
	{
		console.log("data: ", data)
		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			select: {
				id: true
			}
		})
		console.log("userid: ", userid.id)
		const friendid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource
			},
			select: {
				friends: true
			}
		})
		friendid.friends.push(userid.id);
		console.log("friendId: ", friendid.friends);
		await this.prisma.user.update({
			where: {
				accessToken: data.Tokensource
			},
			data: {
				friends: {
					set: friendid.friends
				}
			}
		})

		return {value: true};
	}

	async removeFriend(data : FriendDto) {
		console.log("removing friends... ", data)

		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			
			select: {
				id: true
			}
		})

		console.log("userid: ", userid.id);
		const friendid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource
			},
			select: {
				friends: true
			}
		})

		const index = friendid.friends.indexOf(userid.id);
		console.log("index: ", index);
		if (index > -1) {
			friendid.friends.splice(index, 1);
		}
		await this.prisma.user.update({
			where: {
				accessToken: data.Tokensource
			},
			data: {
				friends: {
					set: friendid.friends
				}
			}
		})
		return {value: true};
	}

	async getFriendStatusById(@Req() req: Request) {

		// 1. Get the user concerned by the request using his token
		// 2. check in this user friends list if the user id gave in the req.headers.id if it is present
		// 3. return true if it is present, false if not

		// console.log("req: ", req.headers.id);
		// console.log("req: ", req.headers.authorization);

		// console.log("req: ", req.body.id);
		// console.log("req: ", req.body.token);

		const user = await this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				friends: true,
			},
		});

		return {value: user.friends.includes(parseInt(req.headers.id as string, 10))};
	}


	// async getFriendStatusById(@Req() req: Request) {

	// 	const userid = await this.prisma.user.findUnique({
	// 		where: {
	// 			accessToken: req.headers.authorization,
	// 		},
	// 		select: {
	// 			id: true,
	// 		}
	// 	})
	// 	console.log("userid: ", userid.id)
	// 	const friendid = await this.prisma.user.findUnique({
	// 		where: {
	// 			accessToken: data.Tokensource
	// 		},
	// 		select: {
	// 			friends: true
	// 		}
	// 	})
	// 	console.log("friendId: ", friendid.friends);
	// 	if (friendid.friends.includes(userid.id)) {
	// 		return {value: true};
	// 	}
	// 	return {value: false};
	// }
	
	async getFriend(data : GetFriendDTO)
	{
		const user = this.prisma.user.findUnique({
			where: { accessToken: data.Tokensource},
			select: { friends: true }
		})
		return (user)
	}

}
