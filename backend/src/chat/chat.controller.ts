import { ChatGateway } from "src/chat/chat.gateway";
import { UserService } from "src/user/user.service";
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	ForbiddenException,
	InternalServerErrorException,
	Logger,
	Param,
	Patch,
	Get,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
//import { ChatMessage, DirectMessage } from "@prisma/client";
import { ChatService } from "src/chat/chat.service";
import { ChannelCreateDto , sendMsgDto } from './dto/create-chat.dto';
import { ChannelMessageSendDto } from './dto/msg.dto';
import { PrismaClient } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { QuitChanDto } from "./dto/edit-chat.dto"

@Controller("chat")
export class ChatController {
	private readonly _logger: Logger;
    private readonly _prisma: PrismaClient;

	constructor(
		private chat_service: ChatService,
		private user_service: UserService,
		//private chat_gateway: ChatGateway,
	) {
		this.chat_service = chat_service;
		this.user_service = user_service;
		//this.chat_gateway = chat_gateway;
		this._logger = new Logger(ChatController.name);
	}

	@Post("newchat")
	//@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async create_one(@Body()dto: ChannelCreateDto)
    {
		console.log(dto);
        const chat = await this.chat_service.newChannel(dto);
        console.log("channel created");
    }

	@Delete("/:id/deletechat")
	async delete_one(@Param("id") id: string)
	{
		var nb_id : number = parseInt(id);
		const chat = await this.chat_service.delChanById(nb_id);
        console.log("channel delete");
	}
	@Post("/:id/newmsg")
	//@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async addMsg(@Body()dto: ChannelMessageSendDto, @Param("id") id: string)
    {
		var nb_id : number = parseInt(id);
        const chat = await this.chat_service.newMsg(dto, nb_id);
        console.log("cMsg added");
    }

	@Get('/channels/:username')
	async take_all_channel(@Param("username") username: string)
	{
		const channel = await this.chat_service.get__channelsUserIn(username);
		console.log("channel : ", channel);
		return channel;
	}


	@Get('/channels/:id')
	async take_all_channelbyId(@Param("id") id: string)
	{
		const channel = await this.chat_service.get__chanNamebyId(parseInt(id));
		console.log("channel : ", channel);
		return channel;
	}

	@Get('/channels/users/:id')
	async take_all_user(@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const users = await this.chat_service.get__UserIn(idChan);
		return users[0].members;
	}

	@Get('/channels/:id/msg')
	async take_all_msg(@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const messages = await this.chat_service.get__MsgIn(idChan);
		console.log("msg: ", messages)
		return messages[0].messages;
	}

	@Get('/channels/users/ban/:id')
	async take_all_ban_user(@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const users = await this.chat_service.get__UserBanIn(idChan);
		console.log("users's ban in channel : ", users[0].banned);
		return users[0].banned;
	}

	// @Post('/channel/quit')
	// async quit_Channel(@Body() dto: QuitChanDto)
	// {
	// 	await this.chat_service.quit_Chan(dto.Token, dto.chatId);
	// 	console.log("users left channel : ");
	// }

	// @Post('/channel/join')
	// async join_Channel(@Body() dto: QuitChanDto)
	// {
	// 	await this.chat_service.join_Chan(dto.Token, dto.chatId);
	// 	console.log("users left channel : ");
	// }
	// @get("chat_list")
	// async take_all_channel(@get_allChan(): )
}
	//#endregion
