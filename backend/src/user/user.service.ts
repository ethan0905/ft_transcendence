import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { FriendDto } from './dto/friend.dto';
import { GetFriendDTO } from './dto/friend.dto';
import { BlockDto } from './dto/friend.dto';

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

	async userExistsInDatabase(@Req() req: Request) {
		const username = Array.isArray(req.headers.username)
			? req.headers.username[0]
			: req.headers.username;

		const user = await this.prisma.user.findUnique({
			where: {
				username: username,
			},
		});

		const loggedUser = await this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
		});

		if (user.username === loggedUser.username) {
			return {value: true, loggedUser: true};
		} else if (user) {
			return {value: true, loggedUser: false};
		} else {
			return {value: false, loggedUser: false};
		}

		// if (user) {
		// 	return {value: true, loggedUser: false};
		// } else {
		// 	return false;
		// }
	}

	async getUserIdByUserName(@Req() req: Request) {

		const username = Array.isArray(req.headers.username)
		? req.headers.username[0]
		: req.headers.username;

		// console.log("username: ", username);

		return this.prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				id: true,
			},
		});
	}

	async addFriend(data : FriendDto)
	{
		console.log("adding friend... ");
		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			select: {
				id: true
			}
		})
		// console.log("userid: ", userid.id)
		const friendid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource
			},
			select: {
				friends: true
			}
		})
		friendid.friends.push(userid.id);
		// console.log("friendId: ", friendid.friends);
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
		console.log("removing friends... ");

		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			
			select: {
				id: true
			}
		})

		// console.log("userid: ", userid.id);
		const friendid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource
			},
			select: {
				friends: true
			}
		})

		const index = friendid.friends.indexOf(userid.id);
		// console.log("index: ", index);
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
	
	// block part
	async blockUser(data : BlockDto)
	{
		console.log("blocking user... ");
		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			select: {
				id: true
			}
		})
		// console.log("userid: ", userid.id)
		const blockid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource
			},
			select: {
				blocked: true
			}
		})
		blockid.blocked.push(userid.id);
		// console.log("blockid: ", blockid.blocked);
		await this.prisma.user.update({
			where: {
				accessToken: data.Tokensource
			},
			data: {
				blocked: {
					set: blockid.blocked
				}
			}
		})

		return {value: true};
	}

	async unblockUser(data : BlockDto) {
		console.log("unblock user... ");

		const userid = await this.prisma.user.findUnique({
			where: {
				username: data.username
			},
			
			select: {
				id: true
			}
		})

		// console.log("userid: ", userid.id);
		const blockid = await this.prisma.user.findUnique({
			where: {
				accessToken: data.Tokensource,
			},
			select: {
				blocked: true,
			}
		})

		const index = blockid.blocked.indexOf(userid.id);
		// console.log("index: ", index);
		if (index > -1) {
			blockid.blocked.splice(index, 1);
		}
		await this.prisma.user.update({
			where: {
				accessToken: data.Tokensource
			},
			data: {
				blocked: {
					set: blockid.blocked
				}
			}
		})
		return {value: true};
	}

	async getBlockStatusById(@Req() req: Request) {

		const user = await this.prisma.user.findUnique({
			where: {
				accessToken: req.headers.authorization,
			},
			select: {
				blocked: true,
			},
		});

		return {value: user.blocked.includes(parseInt(req.headers.id as string, 10))};
	}

	async getFriendListByToken(@Req() req: Request) {

		const user = await this.prisma.user.findUnique({
		  where: {
			accessToken: req.headers.authorization,
		  },
		  select: {
			friends: true,
		  },
		});
	  
		const friendList = user.friends.map(async (friendId) => {
		  const friend = await this.prisma.user.findUnique({
			where: {
			  id: friendId,
			},
			select: {
			  username: true,
			  status: true,
			},
		  });
	  
		//   console.log({
		// 	name: friend.username,
		// 	status: friend.status,
		//   });

		  return {
			name: friend.username,
			status: friend.status,
		  };
		});
	  
		return Promise.all(friendList);
	  }

	  

	// async getGameHistory(@Req() req: Request) {

	// 	const username = Array.isArray(req.headers.username)
	// 	? req.headers.username[0]
	// 	: req.headers.username;

	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			username: username,
	// 		},
	// 		select: {
	// 			games: true,
	// 		},
	// 	});

	// 	const gameList = user.games.map(async (gameId) => {

	// }

	async getGameHistory(@Req() req: Request) {
		const username = Array.isArray(req.headers.username)
		  ? req.headers.username[0]
		  : req.headers.username;

		const games = await this.prisma.game.findMany({
		  where: {
			players: {
			  some: {
				username: username
			  }
			}
		  },
		  select: {
			players: {
			  where: {
				NOT: {
				  username: username
				}
			  },
			  select: {
				username: true
			  }
			},
			score: true,
			createdAt: true
		  }
		});

		return games.map(game => {
		  const [player1, player2] = game.players.map(player => player.username);

			console.log({
			player1,
			player2: username,
			score: game.score,
			date: game.createdAt
			});

		  return {
			player1,
			player2: username,
			score: game.score,
			date: game.createdAt
		  }
		});
	}

}
