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


// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {} //dependency injection

	@Get('me')
	getMe(@GetUser() user: User) {
		return user;
	}

	@Patch()
	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}
	
	@Get('me')
	getUserbyId(@GetUser() user: User) {
		return user;
	}

	@Get('me/username/get')
	getUsername(@Req () req: Request) {
		return this.userService.getUsername(req);
	}

	@Post('me/username/edit')
	editUsername(@Req () req: Request) {
		return this.userService.editUsername(req);
	}

	@Get('me/avatar/get')
	getAvatar(@Req () req: Request) {
		return this.userService.getAvatar(req);
	}

	@Post('me/avatar/upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadAvatar(@UploadedFile() file, @Req() req: Request) {
		return this.userService.uploadAvatar(file, req);
	}

}
