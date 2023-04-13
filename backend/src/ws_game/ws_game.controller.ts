import { Controller, Param, Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ConnectedSocket , MessageBody} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsGameService } from './ws_game.service';

@Controller('ws-game')
export class WsGameController {
	constructor(private readonly WsGameService: WsGameService) {}
	@Get('/rooms')
	getRooms(): any {
		return this.WsGameService.getRooms();
	}

	@Get('/rooms/:room_name/:playerId')
	getRoom(@Param('room_name') room_name:string, @Param('playerId') playerId:string): number {
		return this.WsGameService.getRoles(room_name, playerId);
	}

	@Get('/players')
	getPlayers(): any {
		return this.WsGameService.getPlayers();
	}
}
