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

	@Get('/channels/:token')
	async take_all_channel(@Param("token") Token: string)
	{
		const channel = await this.chat_service.get__channelsUserIn(Token);
		console.log("channel : ", channel);
		return channel;
	}

	@Get('/channels/users/:id')
	async take_all_user(@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const users = await this.chat_service.get__UserIn(idChan);
		console.log("users int channel : ", users);
		return users;
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
