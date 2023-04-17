import { Controller, Get, UseGuards, Req, Patch, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FriendDto, GetFriendDTO } from './dto/friend.dto';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {} //dependency injection

	@Get('me/username/get')
	getUsername(@Req() req: Request) {
		return this.userService.getUsername(req);
	}

	@Get('me/email/get')
	getmail(@Req() req: Request) {
		return this.userService.getmail(req);
	}
	@Get('me/id/get')
	getid(@Req() req: Request) {
		return this.userService.getid(req);
	}
	@Post('me/addfriend')
	addFriend(@Body() data : FriendDto)
	{
		console.log("data on Post:", data)
		this.userService.addfriend(data);
	}
	@Get('me/getfriend')
	getFriend(@Body() data :GetFriendDTO)
	{
		const user = this.userService.getfriend(data)
		return (user)
	}
}
