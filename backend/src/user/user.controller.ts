import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

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
}
