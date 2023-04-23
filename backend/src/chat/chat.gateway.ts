import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChannelCreateDto } from './dto/create-chat.dto';
import { ChannelMessageSendDto, DmMsgSend  } from './dto/msg.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaClient } from '@prisma/client';
import { QuitChanDto, JoinChanDto, EditChannelCreateDto } from "./dto/edit-chat.dto"


export interface User {
  id: number;
  username: string;
  email: string;
}
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
  clients: {[key:string]:User} = {};

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
      const user = await this.prisma.user.findUnique({
        where : {
          accessToken : client.handshake.auth.token,
        },
        select:{
          id: true,
          username: true,
          email: true,
        }
      })
      this.clients[client.id] = user;
      console.log("Connect")
      // console.log(this.clients);
    }
    catch (e){
      console.log(e);
      client.disconnect();
      return;
    }
  }


  handleDisconnect(client: Socket) {
    console.log("Disconnect")
    delete this.clients[client.id];
  }

  @SubscribeMessage('create channel')
  async chat(
    @MessageBody() data: ChannelCreateDto,
    @ConnectedSocket() client: Socket,
  ) {
      const chat = await this.chatService.newChannel(data, this.clients[client.id].username);
      if (!chat.isPrivate)
        this.server.emit("Channel Created", {channelName:data.chatName, id: chat.id, client_id: client.id});
      else
        this.server.to(client.id).emit("Channel Created", {channelName:data.chatName, id: chat.id});
    }

  @SubscribeMessage('sendMsgtoC')
  async MsgtoC(
    @MessageBody()  data: ChannelMessageSendDto,
    @ConnectedSocket() client : Socket,
  ) {
    const chat = await this.chatService.newMsg(data, this.clients[client.id].id);
    if (chat == null)
      return "error";
    this.server.to(data.chatId.toString()).emit("NewMessage",chat); // emit to the room
  }

  @SubscribeMessage('join')
  async join_chan(
    @MessageBody()  data: JoinChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
    {
      this.server.to(client.id).emit("error", "Error refresh the page!!!");
      return;
    }
    const user = await this.userService.getUser(this.clients[client.id].username);
    const ret = await this.chatService.join_Chan(data, user);
    if (ret === 0 || ret === 5){
      client.join(data.chatId.toString());
      if (ret !== 5)
        client.to(data.chatId.toString()).emit("NewUserJoin", {username: user.username, id: user.id, status: user.status, avatarUrl: user.avatarUrl})
      this.server.to(client.id).emit("Joined", {chatId: data.chatId});
    }
    else if (ret  == 1)
    this.server.to(client.id).emit("error", "NotInvited");
    else if (ret == 2)
    this.server.to(client.id).emit("error", "Banned");
    else if (ret == 3){
      this.server.to(client.id).emit("error", "Wrong password");
    }
    else{
      this.server.to(client.id).emit("error", "This channel does not exist!!!");
    }
  }

  @SubscribeMessage('quit')
  async quit_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
    ) {
      if (this.clients[client.id] === undefined)
      return;
    const quit = await this.chatService.quit_Chan(this.clients[client.id].username, data.chatId);
    console.log("user quit: " + this.clients[client.id].username);
  }

  @SubscribeMessage('invit')
  async inv_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    await this.chatService.invit_Chan(this.clients[client.id].username, data.chatId);
    console.log("user invited");
  }

  @SubscribeMessage('ban')
  async ban_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    await this.chatService.ban_Chan(this.clients[client.id].username, data.chatId);
    console.log("chan banned");
  }

  @SubscribeMessage('kick')
  async kick_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    await this.chatService.kick_Chan(this.clients[client.id].username, data.chatId);
    console.log("chan kicked");
  }

  
  @SubscribeMessage('mute')
  async mute_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    await this.chatService.mute_Chan(this.clients[client.id].username, data.chatId);
    console.log("chan muteed");
  }

    
  @SubscribeMessage('unmute')
  async unmute_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    await this.chatService.unmute_Chan(this.clients[client.id].username, data.chatId);
    console.log("chan unmuteed");
  }


  @SubscribeMessage('is ban')
  async isban_chan(
    @MessageBody()  data: QuitChanDto ,
    @ConnectedSocket() client : Socket,
  ) {
    if (this.clients[client.id] === undefined)
      return;
    const res : boolean = await this.chatService.isBan_Chan(this.clients[client.id].username, data.chatId);
    if (res == true)
      console.log("user is banned");
    else
    console.log("user is not banned");
  }

  // @SubscribeMessage('update')
  // async update_chan(
  //   @MessageBody()  data: EditChannelCreateDto ,
  //   @ConnectedSocket() client : Socket,
  // ) {
  //   if (this.clients[client.id] === undefined)
  //     return;
  //   const res : number = await this.chatService.update_chan(data);
  //   if (res == 1)
  //     console.log("Password is empty but chan need password");
  //   else if (res == 2)
  //     console.log("not an admin");
  //   else
  //     console.log("chan updated");
  // }

}