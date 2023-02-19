import { Controller, Get, Post, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { ChatDto } from './dto';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { Tag } from './style/chat.style'


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

  @Post()
  async createNewChannel(@Body() info: ChatDto): Promise<ChatDto> {
    const newChannel = await this.chatService.newChannel(info);
    const isPassword = info.Password ? true : false;
    const tags: Tag[] = newChannel.members.map(member => ({
      id: member.id,
      name: member.name
    }));
    const createdChannel: ChatDto = {
      chatName: newChannel.chatName,
      isPassword: isPassword,
      members: tags
    };
    return createdChannel;
  }
}