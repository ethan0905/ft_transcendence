import { Body, Controller, Post, Get, Req, Res, ParseIntPipe, HttpCode, HttpStatus, UseGuards } from "@nestjs/common"
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { FortyTwoAuthGuard } from "./guard/42.guard";

@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	//POST /auth/signup
	@Post('signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	// this route is protected by the FortyTwoAuthGuard
	@UseGuards(FortyTwoAuthGuard) // the user must be authenticated to access this route
	//GET /auth/42
	@Get('42/callback') // this route is called by the 42 API
	async callback_42(@Req() request: any, @Res() response: Response): Promise<void> {
	  const token = await this.authService.signin_42(request.user as FortyTwoUser);
  
	  const url = new URL(`${request.protocol}:${request.hostname}`);
	  url.port = "3000";
	  url.pathname = 'login';
	  url.searchParams.set('code', token);
  
	  response.status(302).redirect(url.href);
	}
  

	@HttpCode(HttpStatus.OK) //send a 200 code for clarity
	//POST /auth/signin
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}
}