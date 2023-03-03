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

@UsePipes(new ValidationPipe())
 @WebSocketGateway({
     cors: {
     origin: '*',
   },
   namespace: 'chat',
  })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    // private readonly userService: UserService,
  ) {}

  async handleJoinSocket(id: number, @ConnectedSocket() client: Socket) {
		const channels = await this.chatService.get__channelsUserIn(id);
		await client.join('default_all');
		if (channels)
			for (const channel of channels) {
				await client.join(channel);
			}
	}


  @SubscribeMessage('create channel')
  async chat(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
      const chat = await this.chatService.newChannel(data);
      if (chat) {
        client.broadcast.emit('chat', chat);
    }
  }

  // @SubscribeMessage('updateChat')
  // @UsePipes(new ValidationPipe())
  // async updateChat(
  //   @MessageBody() data: updateChat,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   try {

    
  //     await this.chatService.updateChat(data);
  //     client.broadcast.emit('updateChat', data);
  //   }
  //   catch {
  //     client.broadcast.emit('fail to updtae', data)
  //   }
  // }
}