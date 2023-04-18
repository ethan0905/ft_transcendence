import { Controller, Get, UseGuards, Req, Patch, Body, Post } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { FriendDto } from './dto/friend.dto';
import { GetFriendDTO } from './dto/friend.dto';
import { BlockDto } from './dto/friend.dto';

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

	@Get('username/valid')
	userExistsInDatabase(@Req() req: Request) {
		return this.userService.userExistsInDatabase(req);
	}

	@Get('id/get')
	getUserIdByUserName(@Req() req: Request) {
		return this.userService.getUserIdByUserName(req);
	}

	// friend part
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

	// block part
	@Post('me/blockuser')
	blockUser(@Body() data : BlockDto)
	{
		return this.userService.blockUser(data);
	}

	@Post('me/unblockuser')
	unblockUser(@Body() data : BlockDto)
	{
		return this.userService.unblockUser(data);
	}

	@Get('me/getblockstatus')
	getBlockStatusById(@Req() req: Request)
	{
		return this.userService.getBlockStatusById(req);
	}

	@Get('me/getfriendlist')
	getFriendListByToken(@Req() req: Request)
	{
		return this.userService.getFriendListByToken(req);
	}
	
	@Get('me/game/history/get')
	getGameHistory(@Req() req: Request)
	{
		return this.userService.getGameHistory(req);
	}
}
