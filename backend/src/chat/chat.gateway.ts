import { UseFilters } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChannelCreateDto } from './dto/create-chat.dto';
import { ChannelMessageSendDto, DmMsgSend  } from './dto/msg.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import {
	updateChat,
} from './type/chat.type';
import { UserService } from 'src/user/user.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { QuitChanDto, JoinChanDto, EditChannelCreateDto } from "./dto/edit-chat.dto"

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   users: number = 0;

//   constructor() {
//     this.server = new Server();
//   }

//    handleConnection() {
//     // A client has connected
//     this.users++;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//    handleDisconnect() {
//     // A client has disconnected
//     this.users--;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   @SubscribeMessage('chat')
//    onChat(client, message) {
//     client.broadcast.emit('chat', message);
//   }
// }

@UsePipes(new ValidationPipe())
 @WebSocketGateway({
     cors: {
     origin: 'http://localhost:3080',
   },
   namespace: 'chat',
  })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaClient,
    private readonly userService: UserService,
  ) {
    this.server = new Server();
  }



  async handleConnection(client: Socket) : Promise<any> {
    try
    {
      console.log('someone test connection');
      client.emit('test', {client}); // join all rooms
    }
    catch {}
  }

  // async handleJoinSocket(id: number, @ConnectedSocket() client: Socket) {
	// 	// const channels = await this.chatService.get__channelsUserIn(id);
	// 	// await client.join('default_all');
	// 	// if (channels)
	// 	// 	for (const channel of channels) {
	// 	// 		await client.join(channel);
	// 	// 	}
	// }


  @SubscribeMessage('create channel')
  async chat(
    @MessageBody() data: ChannelCreateDto,
    @ConnectedSocket() client: Socket,
  ) {
      const chat = await this.chatService.newChannel(data);
      const id_room = await this.prisma.channel.findMany({
        where : {
          channelName: data.chatName,
        },
        select: {
          id: true,
          isPrivate:true,
        },
      })
      const id = id_room[0].id;
      client.join(id.toString());
      if (!id_room[0].isPrivate)
        this.server.emit("Channel Created", {channelName:data.chatName, id: id});
    }

  @SubscribeMessage('sendMsgtoC')
  async MsgtoC(
    @MessageBody()  data: ChannelMessageSendDto,
    @ConnectedSocket() client : Socket,
  ) {
    const user = await this.prisma.user.findUnique({
      where : {
        email : data.mail,
      },
    }
    )
    const chat = await this.chatService.newMsg(data, user.id);
    console.log("cMsg added");
    this.server.to(data.chatId.toString()).emit("NewMessage",chat); // emit to the room
  }

  // @SubscribeMessage('sendMsgtoC')
  // async MsgtoUser(
  //   @MessageBody()  data: DmMsgSend ,
  //   @ConnectedSocket() client : Socket,
  // ) {
  //   const user = await this.prisma.user.findUnique({
  //     where : {
  //       email : data.mail,
  //     },
  //   }
  //   )
  //   const chat = await this.chatService.newDM(data, user.id);
  //   console.log("cMsg added");
  // }

  @SubscribeMessage('join')
  async join_chan(
    @MessageBody()  data: JoinChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    const ret = await this.chatService.join_Chan(data);
    if (ret == 0 ){
      const user = await this.userService.getUser(data.username)
      client.join(data.chatId.toString());
      client.to(data.chatId.toString()).emit("NewUserJoin", user)
    }
    else if (ret  == 1)
      console.log("chan is Private");
    else if (ret == 2)
      console.log("user has ban");
    else if (ret == 3)
      console.log("wrong password");
  }

  @SubscribeMessage('quit')
  async quit_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    await this.chatService.quit_Chan(data.username, data.chatId);
    console.log("chan quitted");
  }

  @SubscribeMessage('invit')
  async inv_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    await this.chatService.invit_Chan(data.username, data.chatId);
    console.log("user invited");
  }

  @SubscribeMessage('ban')
  async ban_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    await this.chatService.ban_Chan(data.username, data.chatId);
    console.log("chan banned");
  }

  @SubscribeMessage('kick')
  async kick_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    await this.chatService.kick_Chan(data.username, data.chatId);
    console.log("chan kicked");
  }

  @SubscribeMessage('is ban')
  async isban_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    const res : boolean = await this.chatService.isBan_Chan(data.username, data.chatId);
    if (res == true)
      console.log("user is banned");
    else
    console.log("user is not banned");
  }

  @SubscribeMessage('update')
  async update_chan(
    @MessageBody()  data: EditChannelCreateDto ,
    @ConnectedSocket() client : Socket,
  ) {
    
    const res : number = await this.chatService.update_chan(data);
    if (res == 1)
      console.log("Password is empty but chan need password");
    else if (res == 2)
      console.log("not an admin");
    else
      console.log("chan updated");
  }

  // // @SubscribeMessage('updateChat')
  // // @UsePipes(new ValidationPipe())
  // // async updateChat(
  // //   @MessageBody() data: updateChat,
  // //   @ConnectedSocket() client: Socket,
  // // ) {
  // //   try {

    
  // //     await this.chatService.updateChat(data);
  // //     client.broadcast.emit('updateChat', data);
  // //   }
  // //   catch {
  // //     client.broadcast.emit('fail to updtae', data)
  // //   }
}