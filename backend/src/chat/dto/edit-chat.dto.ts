import { IsEmail, IsOptional, IsString , IsTrue } from 'class-validator';
import { IsUser } from '../../user/validators/is-user.validator';


export class ChatDto{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUser()
    @IsOptional()
    users?: string[];

    @IsTrue()
    @IsOptional()
    isPrivate?: boolean;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    passwordConfirmation?: string;

    @IsString()
    @IsOptional()
    Admin?: string[];

    @IsString()
    @IsOptional()
    Msg?: string[];
}