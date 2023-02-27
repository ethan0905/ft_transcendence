import { UseFilters } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/create-chat.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import {
	updateChat,
} from './type/chat.type';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('chat')
  @UsePipes(new ValidationPipe())
  async chat(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
      const chat = await this.chatService.newChannel(data);
      if (chat) {
        client.broadcast.emit('chat', chat);
    }
  }

  @SubscribeMessage('updateChat')
  @UsePipes(new ValidationPipe())
  async updateChat(
    @MessageBody() data: updateChat,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.userService.findUserByEmail(data.email);
    if (user) {
      user
      const chat = await this.chatService.updateChat(data);
      if (chat) {
        client.broadcast.emit('updateChat', chat);
      }
    }
  }
}