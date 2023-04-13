import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

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
}
