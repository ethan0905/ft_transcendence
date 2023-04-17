import { Controller, Get, UseGuards, Req, Patch, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
// import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Param } from '@nestjs/common';

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

	// @Post('me/addfriend')
	// addFriend(@Body() data : FriendDto)
	// {
	// 	// console.log("data on Post:", data)
	// 	this.userService.addFriend(data);
	// }
	// @Get('me/getfriend')
	// getFriend(@Body() data :GetFriendDTO)
	// {
	// 	const user = this.userService.getFriend(data)
	// 	return (user);
	// }

}
