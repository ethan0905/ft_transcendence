import { Body, Controller, Post, Get, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common"
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
	afterRedirection() {
		return this.authService.afterRedirection();
	}
}