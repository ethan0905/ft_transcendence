import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {v4 as uuidv4} from 'uuid';

type Ball={
	x: number;
	y: number;
	vx: number;
	vy: number;
	speed: number;
	radius: number;
}

type Game = {
	player1_position: number;
	player2_position: number;
	player1_score: number;
	player2_score: number;
	is_playing: boolean;
	ball: Ball;
}
type Room = {
	name: string;
	player1: string;
	player2: string;
	spectators: string[];
	game: Game;
}

@Injectable()
export class WsGameService {
	number_of_player: number = 0;
	rooms: {[key:string]:Room} = {};
	queue: string[] = [];
	clients:{[key:string]:Socket} = {};

	getNumberOfConnectedPeople(): number {
		return this.number_of_player;
	}

	newUserConnected(client:Socket, server:Server): void {
		this.number_of_player++;
		server.emit('ConnectedPlayer', this.number_of_player);
		console.log("Connected "+ client.id + " ConnectedClient:" + this.getNumberOfConnectedPeople());
	}
	
	userDisconnected(client:Socket, server:Server): void {
		this.number_of_player--;
		server.except(client.id).emit('ConnectedPlayer', this.number_of_player);
		if (this.queue.includes(client.id))
			this.queue.splice(this.queue.indexOf(client.id), 1);
		let playerid = Object.keys(this.clients).find(key => this.clients[key].id === client.id);
		for (let room in this.rooms) {
			if (this.rooms[room].player1 === playerid) {
				this.leaveRoom(this.rooms[room].name, playerid, server);
			}
			else if (this.rooms[room].player2 === playerid) {
				this.leaveRoom(this.rooms[room].name, playerid, server);
			}
		};
		console.log("Disconnected "+client.id + " ConnectedClient:" + this.getNumberOfConnectedPeople());
	}

	userReconnected(client:Socket, server:Server): void {
		this.number_of_player++;
		server.emit('ConnectedPlayer', this.number_of_player);
		console.log("Reconnected "+client.id + " ConnectedClient:" + this.getNumberOfConnectedPeople());
	}

	createRoom(client1:string,client2:string,server:Server): void {
		const room: Room = {
			name: uuidv4(),
			player1: client1,
			player2: client2,
			spectators: [],
			game: {
				player1_position: 0,
				player2_position: 0,
				player1_score: 0,
				player2_score: 0,
				is_playing: false,
				ball: {
					x: 0.5,
					y: 0.5,
					vx: 0.001,
					vy: 0.001,
					speed: 0,
					radius: 0.015,
				}
			}
		}

		this.rooms[room.name] = room;
	
		// client1.join(room.room_name.toString());
		// client2.join(room.room_name.toString());
		console.log("Room created: " + room.name);
		// server.to(room.name).emit('RoomCreated', room);
		server.emit('RoomCreated', room);
		server.to([this.clients[client1].id, this.clients[client2].id]).emit('FindGame', room.name);
		// server.in(room.room_name).fetchSockets().then((sockets) => {
		//   console.log(sockets.length)
		// })
	}

	// joinRoom(client:Socket, server:Server, room_name:string): void {
	//   const room: Room = this.rooms.find(room => room.room_name === room_name);
	//   if (room) {
	//     if (room.player2 === '') {
	//       room.player2 = client.id;
	//       client.join(room.room_name);
	//       server.to(room.room_name).emit('RoomJoined', room.room_name);
	//     } else {
	//       room.spectators.push(client.id);
	//       client.join(room.room_name);
	//       server.to(room.room_name).emit('RoomJoined', room.room_name);
	//     }
	//   }
	// }

	ClientSession(client:Socket, server:Server, playerId:string): void {
		console.log("SessionId: " + playerId + " newclient:"+ client.id);
		// console.log("Clients: " + this.clients);
		this.clients[playerId] = client;
	}

	matchmaking(client:string, server:Server): void {
		if (this.queue.includes(client))
			return; // already in queue
		// Verifier si le client est connecte
		this.queue.push(client);
		if (this.queue.length > 1) {
			const player1: string = this.queue[0];
			const player2: string = this.queue[1];
			this.queue.splice(0, 2);
			this.createRoom(player1, player2, server);
		}
	}

	MakeMove(client: Socket, server:Server, data: any): void {
		console.log("MakeMove: " + data.id_game + ":" + data.player + ":" + data.position);
		if (this.rooms[data.id_game] !== undefined) {
			if (data.player == 1)
				this.rooms[data.id_game].game.player1_position = data.position;
			else if (data.player == 2)
				this.rooms[data.id_game].game.player2_position = data.position;
		}
		server.to(data.id_game.toString()).except(client.id).emit('UpdateCanvas', {player_role: data.player, position: data.position});
	}

	getRoles(room_name: string, playerId: string): number {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			if (room.player1 == playerId)
				return 1;
			else if (room.player2 == playerId)
				return 2;
			else
				return 3;
		}
		return 0;
	}

	joinRoom(room_name:string, client_id:string,server:Server): void {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			console.log("JoinRoom: " + room_name + " " + client_id + " P1 :" + room.player1 + " P2:" + room.player2)
			if (room.player1 === client_id){
				server.in(room.name).fetchSockets().then((sockets) => {
					for (let i = 0; i < sockets.length; i++) {
						if (sockets[i].id === this.clients[room.player2].id)
							this.startGame(room.name,server);
					}
				})
				this.clients[client_id].join(room.name);
			}
			else if (room.player2 === client_id) {
				this.clients[client_id].join(room.name);
				server.in(room.name).fetchSockets().then((sockets) => {
					for (let i = 0; i < sockets.length; i++) {
						if (sockets[i].id === this.clients[room.player1].id)
							this.startGame(room.name,server);
					}
				})
			}
			else {
				room.spectators.push(client_id);
				this.clients[client_id].join(room.name);
			}
		}
	}

	leaveRoom(room_name:string, client_id:string,server:Server): void {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			console.log("LeaveRoom: " + room_name + " " + client_id + " P1 :" + room.player1 + " P2:" + room.player2)
			if (room.player1 === client_id) {
				// this.clients[client_id].leave(room.name);
				room.player1 = "";
				if (room.game.is_playing === true){
					room.game.player1_score = 0;
					room.game.player2_score = 11;
					room.game.is_playing = false;
					room.game.ball.speed = 0;
				}
				server.to(room.name).emit('PlayerLeft', {player:1, score:[room.game.player1_score, room.game.player2_score]});
				server.socketsLeave(room.name);
				// ajouter dans la bdd | efaccer la room de la liste
				delete this.rooms[room_name];
			}
			else if (room.player2 === client_id) {
				// this.clients[client_id].leave(room.name);
				room.player2 = "";
				if (room.game.is_playing === true){
					room.game.player1_score = 11;
					room.game.player2_score = 0;
				}
				server.to(room.name).emit('PlayerLeft', {player:2, score:[room.game.player1_score, room.game.player2_score]});
				server.to(room.name).emit('PlayerLeft', {player:1, score:[room.game.player1_score, room.game.player2_score]});
				server.socketsLeave(room.name);
				// ajouter dans la bdd | efaccer la room de la liste
				delete this.rooms[room_name];
			}
			else {
				room.spectators.splice(room.spectators.indexOf(client_id), 1);
				server.to(room.name).emit('SpectatorLeft', room.spectators);
			}
		}
	}

	startGame(room_name:string, server:Server): void {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			room.game.is_playing = true;
			room.game.ball.speed = 1;
			server.to(room.name).emit('StartGame', room.name);
			server.emit('NewMatch', this.rooms);
		}
	}

	UpdateScore(room_name:string, player:number, server:Server): void {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			if (player == 1)
				room.game.player1_score++;
			else
				room.game.player2_score++;
			server.to(room.name).emit('UpdateScore', {score:[room.game.player1_score,room.game.player2_score]});
			if (room.game.player1_score == 11 || room.game.player2_score == 11)
				console.log("EndGame");
			//this.endGame(room_name, server);
		}
	}

	requestBallPosition(room_name:string, server:Server): void {
		const room: Room = this.rooms[room_name];
		if (room !== undefined) {
			let ball = room.game.ball;
			server.to(room.name).emit('GetBallPosition', ball);
			if (ball.x - ball.radius <= 0.02 && (ball.y >= this.rooms[room_name].game.player2_position && ball.y <= this.rooms[room_name].game.player2_position + 0.2) ){
				ball.vx = (-ball.vx * ball.speed);
			}
			else if (ball.x + ball.radius >= 1 - (0.02) && (ball.y >= this.rooms[room_name].game.player1_position && ball.y <= this.rooms[room_name].game.player1_position + 0.2)){
				ball.vx = (-ball.vx * ball.speed);
			}
			else if (ball.x - ball.radius <= 0.02){
				console.log("GOAL 1: ORIENTATION 0")
				ball.x = 0.5;
				ball.y = 0.5;
				this.rooms[room_name].game.player1_score++;
				this.UpdateScore(room_name, 1, server);
			}
			else if (ball.x + ball.radius >= (1 - 0.02)){
				console.log("GOAL 2 Orientation 0")
				ball.x = 0.5;
				ball.y = 0.5;
				this.rooms[room_name].game.player2_score++;
				this.UpdateScore(room_name, 2, server);
			}
			else if (ball.y - ball.radius < 0){
				ball.vy = (-ball.vy * ball.speed);
			}
			else if (ball.y + ball.radius  >= 1){
				ball.vy = (-ball.vy * ball.speed);
			}
			ball.x += (ball.vx * ball.speed);
			ball.y += (ball.vy * ball.speed);
			this.rooms[room_name].game.ball = ball;
			// console.log("Ball Position: " + ball.x + ":" + ball.y + ":" + ball.vx + ":" + ball.vy);
		}
	}

	getRooms(): {[key:string]:Room}{
		return this.rooms;
	}

	getPlayers(): number{
		return this.number_of_player;
	}
}
