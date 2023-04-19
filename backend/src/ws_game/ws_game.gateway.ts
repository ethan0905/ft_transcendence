import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket ,WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { WsGameService } from './ws_game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4343, {transports:['websocket'], namespace: 'ws-game', cors: true})

// export class WsGameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
export class WsGameGateway{
  @WebSocketServer() server: Server;
  // server: Server;
  constructor(private readonly wsGameService: WsGameService) {}
  
  //creer un tableau d'objet room {room_name, number_of_player or clients[], scores[], is_playing}

  afterInit() {
    console.log("Init");
  }
  
  @SubscribeMessage('ConnectedPlayer')
  handleConnectedPlayer(data:number): number {
    console.log("Event connection")
    return data;
  }

  handleConnection(client: Socket) {
    this.wsGameService.newUserConnected(client, this.server);
  }

  handleDisconnect(client: Socket) {
    this.wsGameService.userDisconnected(client, this.server);
  }

  handleReconnect(client: Socket) {
    console.log("New Reconnection")
    this.wsGameService.userReconnected(client, this.server);
  }
  // Function for create a room for playing
  // @SubscribeMessage('CreateRoom')
  // handleCreateRoom(@ConnectedSocket() client: Socket): void {
  //   this.wsGameService.createRoom(client, this.server);
  // }

  @SubscribeMessage('ClientSession')
  handleClientSession(@ConnectedSocket() client: Socket, @MessageBody() playerId:string): void {
    this.wsGameService.ClientSession(client, this.server, playerId);
  }

  @SubscribeMessage('matchmaking')
  handleMatchmaking(@MessageBody() client_id:string): void {
    this.wsGameService.matchmaking(client_id, this.server);
  }

  @SubscribeMessage('JoinRoom')
  handleJoinRoom(@MessageBody() data:any) : void {
    this.wsGameService.joinRoom(data.room_name,data.playerId, this.server);
  }

  @SubscribeMessage('LeaveRoom')
  handleLeaveRoom(@MessageBody() data:any) : void {
    this.wsGameService.leaveRoom(data.room_name,data.playerId, this.server);
  }

  @SubscribeMessage('MakeMove')
  handleMakeMove(@ConnectedSocket() client: Socket, @MessageBody() data: any): void {
    console.log("client : " + client.id)
    this.wsGameService.MakeMove(client, this.server,data);
  }

  @SubscribeMessage('StartGame')
  handleStartGame(@MessageBody() data:any) : void {
    this.wsGameService.startGame(data.room_name, this.server);
    // this.wsGameService.requestBallPosition(data.room_name, this.server);
  }

  // @SubscribeMessage('RequestBallPosition')
  // handleRequestBallPosition(@MessageBody() data:any) : void {
  //   this.wsGameService.requestBallPosition(data.room_name, this.server);
  // }

  // Function for join a room for playing
  // @SubscribeMessage('JoinRoom')
  // handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room_name: string): void {
  //   this.wsGameService.joinRoom(client, this.server, room_name);
  // }
  // Function for leave a room for playing

  // Function for start a game

  // Function for list all player in a room 

}
