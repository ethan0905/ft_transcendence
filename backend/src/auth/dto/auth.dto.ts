import { IsEmail, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

// 42 API DTO
export class Auth42Dto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}
