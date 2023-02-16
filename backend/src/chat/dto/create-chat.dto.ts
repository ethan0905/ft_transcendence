import { IsString, IsNotEmpty, IsOptional } from 'class-validator'; 

export class CreateChatDto {
    @IsString()
    @IsNotEmpty()
    chatName: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @

    // @IsString()
    // @IsOptional()
    // Password?: string;
}