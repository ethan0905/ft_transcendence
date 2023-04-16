import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, IsArray, IsNumber, isNotEmpty, isNumber } from 'class-validator';

export class FriendDto {
    @IsString()
    @IsNotEmpty()
    username : string;

    @IsString()
    @IsNotEmpty()
    Tokensource : string;
}
