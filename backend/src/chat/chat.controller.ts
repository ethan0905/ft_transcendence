import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditChatDto } from './dto';
// import { UserService } from './user.service';
import { ChatService } from './chat.service';

@UseGuards(JwtGuard)
// @Controller('users')
// export class UserController {
// 	constructor(private userService: UserService) {} //dependency injection

// 	@Get('me')
// 	getMe(@GetUser() user: User) {
// 		return user;
// 	}

// 	@Patch()
// 	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
// 		return this.userService.editUser(userId, dto);
// 	}
// }

@Controller('chats')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    getChats(@getChats() chat: Chat) {
        return this.chatService.getChats(user.id);
    }

    @Patch()
    editChat(@GetUser('id') userId: number, @Body() dto: EditChatDto) {
        return this.chatService.editChat(userId, dto);
    }
}