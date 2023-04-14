import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditChannelCreateDto{
    @IsNumber()
    channelid?: number;

    @IsString()
    @IsOptional()
    newname?: string;

    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;

    @IsOptional()
    @IsBoolean()
    isPassword?: boolean;

    @IsString()
    @IsOptional()
    Password?: string;

    @IsString()
    username?: string;

    // @IsString()
    // @IsOptional()
    // PasswordConfirmation?: string;
}

export class QuitChanDto{
    @IsNumber()
    chatId?: number;

    //@IsUser()
    @IsString()
    username?: string;

    // @IsTrue()
    // @IsOptional()
    // isPrivate?: boolean;

    // @IsString()
    // @IsOptional()
    // Password?: string;

    // @IsString()
    // @IsOptional()
    // PasswordConfirmation?: string;
}

export class JoinChanDto{
    @IsNumber()
    chatId?: number;

    //@IsUser()
    @IsString()
    username?: string;

    // @IsTrue()
    // @IsOptional()
    // isPrivate?: boolean;

    @IsString()
    @IsOptional()
    Password?: string;

    // @IsString()
    // @IsOptional()
    // PasswordConfirmation?: string;
}