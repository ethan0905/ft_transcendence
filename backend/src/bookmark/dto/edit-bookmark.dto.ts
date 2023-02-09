import { IsString, IsNotEmpty, IsOptional } from 'class-validator'; 

export class EditBookmarkDto {
	@IsString()
	@IsOptional() //@IsOptional() this is for the validation to know
	title?: string; //?: this is for typescript to know

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional() 
	link?: string;
}