import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, IsArray, IsNumber } from 'class-validator';
import { Tag } from '../type/chat.type';

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    chatName : string;

    @IsBoolean()
    isPrivate : boolean;

    @IsBoolean()
    isPassword : boolean;

    @IsString()
    @IsOptional()
    Password :  string;

    @IsArray()
    @IsOptional()
    members :   Array<Tag>
}

export class sendMsgDto {
    @IsEmail()
    @IsOptional()
    email : string

    @IsNumber()
    @IsNotEmpty()
    chatId : number

    @IsString()
    @IsNotEmpty()
    msg : string

    @IsNumber()
    @IsNotEmpty()
    msgId : number

}

export class DmDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@IsNotEmpty()
	targetId: number;
    
}