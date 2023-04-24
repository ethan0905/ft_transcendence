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
	Res,
} from "@nestjs/common";
//import { ChatMessage, DirectMessage } from "@prisma/client";
import { ChatService } from "src/chat/chat.service";
import { ChannelCreateDto , sendMsgDto } from './dto/create-chat.dto';
import { ChannelMessageSendDto } from './dto/msg.dto';
import { PrismaClient } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { QuitChanDto } from "./dto/edit-chat.dto"
import { Response } from "express";

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

	// @Post("newchat")
	// //@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	// async create_one(@Body()dto: ChannelCreateDto)
    // {
	// 	// console.log(dto);
    //     return this.chat_service.newChannel(dto);
    //     // console.log("channel created");
    // }

	// @Delete("/:id/deletechat")
	// async delete_one(@Param("id") id: string)
	// {
	// 	var nb_id : number = parseInt(id);
	// 	return this.chat_service.delChanById(nb_id);
    //     // console.log("channel delete");
	// }
	// @Post("/:id/newmsg")
	// //@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	// async addMsg(@Body()dto: ChannelMessageSendDto, @Param("id") id: string)
    // {
	// 	var nb_id : number = parseInt(id);
    //     return this.chat_service.newMsg(dto, nb_id);
    //     // console.log("cMsg added");
    // }

	@Get('/channels/')
	async getUserChannels(@Req() req:Request)
	{
		const channels = await this.chat_service.get__channelsUserIn(req.headers["authorization"]);
		const channels_to_join = await this.chat_service.get__channelsUserCanJoin(req.headers["authorization"]);
		// Check if throw error
		return {MyChannels:channels, ChannelsToJoin:channels_to_join};
	}

	@Get('/channels/:id')
	async getChannelName(@Param("id") id: string)
	{
		const channel_name = await this.chat_service.get__chanNamebyId(parseInt(id));
		return channel_name;
	}

	@Get('/channels/:id/isprotected')
	async getChannelsProtection(@Req() req:Request, @Param("id") id: string)
	{	
		const pwd = await this.chat_service.getChannelProtection(parseInt(id));
		const userIsInChan = await this.chat_service.userIsInChan(req.headers["authorization"],parseInt(id));
		if (userIsInChan)
			return false;
		if (pwd.password === '')
			return false;
		return true;
	}

	@Get('/channels/users/:id')
	async getChannelUsers(@Req() req: Request,@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const users = await this.chat_service.get__UserIn(idChan);
		const user = await this.chat_service.getUsername(req.headers["authorization"])
		if (users.length === 0 || user === null)
			return {status:"none"};
		if (users[0].admins.find((element) => element.username === user.username)!== undefined){
			return {status: "admin", admins: users[0].admins, members: users[0].members, muted: users[0].muted, banned: users[0].banned};
		}
		if (users[0].members.find((element) => element.username === user.username) !== undefined
			|| users[0].muted.find((element) => element.username === user.username) !== undefined
		){
			return {status: "member", admins: users[0].admins, members: users[0].members, muted: users[0].muted, banned: users[0].banned};
		}
		return {status:"none"};
	}

	@Get('/channels/:id/msg')
	async getChannelMessages(@Req() req:Request,@Param("id") id : string, @Res() res: Response)
	{
		const idChan : number = parseInt(id);
		const isInChan = await this.chat_service.userIsInChan(req.headers["authorization"], idChan);
		if (isInChan)
		{
			const messages = await this.chat_service.get__MsgIn(idChan);
			return res.status(200).json(messages[0].messages);
		}
		return res.status(403).json({message:"You are not in this channel"});
	}

	// Not use
	@Get('/channels/users/ban/:id')
	async getChannelUsersBan(@Param("id") id : string)
	{
		const idChan : number = parseInt(id); 
		const users = await this.chat_service.get__UserBanIn(idChan);
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
