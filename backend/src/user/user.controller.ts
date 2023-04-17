import { Controller, Get, UseGuards, Req, Patch, Body, Post } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { FriendDto } from './dto/friend.dto';
import { GetFriendDTO } from './dto/friend.dto';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {} //dependency injection

	@Get('me/username/get')
	getUsername(@Req() req: Request) {
		return this.userService.getUsername(req);
	}

	@Post('me/username/edit')
	editUsername(@Req() req: Request) {
		return this.userService.editUsername(req);
	}

	@Get('me/email/get')
	getEmail(@Req() req: Request) {
		return this.userService.getEmail(req);
	}
	@Get('me/id/get')
	getId(@Req() req: Request) {
		return this.userService.getId(req);
	}

	@Get('username/get')
	getUserNameById(@Req() req: Request) {
		return this.userService.getUserNameById(req);
	}

	@Post('me/addfriend')
	addFriend(@Body() data : FriendDto)
	{
		return this.userService.addFriend(data);
	}

	@Post('me/removefriend')
	removeFriend(@Body() data : FriendDto)
	{
		return this.userService.removeFriend(data);
	}

	@Get('me/getfriendstatus')
	getFriendStatusById(@Req() req: Request)
	{
		return this.userService.getFriendStatusById(req);
	}

	@Get('me/getfriend')
	getFriend(@Body() data :GetFriendDTO)
	{
		const user = this.userService.getFriend(data)
		return (user);
	}

}
