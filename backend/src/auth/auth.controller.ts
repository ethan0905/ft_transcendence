import { Body, Controller, Post, Get, ParseIntPipe, HttpCode, HttpStatus, Req, Res } from "@nestjs/common"
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, Auth42Dto } from './dto';

@Controller('auth')
export class AuthController{
	constructor(
		private authService: AuthService
	) {}

	// //POST /auth/signup
	// @Post('signup')
	// signup(@Body() dto: AuthDto) {
	// 	return this.authService.signup(dto);
	// }

	@HttpCode(HttpStatus.OK) //send a 200 code for clarity
	//POST /auth/signin
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}

	@Get('/')
	testAuth() {
		return this.authService.testAuth();
	}

	@Get('42')
	signin42(@Body() dto: Auth42Dto) {
		console.log("/auth/42 controller");
	}

	@Get('42/callback')
	async getToken(@Req() req: Request, @Res() res: Response) {
		const code = req.query.code as string;
		console.log("req.query.code = " + code);
	
		const token = await this.authService.accessToken(code);
		console.log(token);

		res.redirect(`http://localhost:3000/?token=${token.access_token}`);
	}
}