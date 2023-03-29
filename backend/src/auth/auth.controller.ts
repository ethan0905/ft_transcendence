import { Body, Controller, Post, Get, ParseIntPipe, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, Auth42Dto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  // @Get('42')
  // signin42(@Body() dto: Auth42Dto) {
  // 	console.log("/auth/42 controller");
  // }

  @Get('42/callback')
  async getToken( @Req() req: Request, @Res() res: Response) {

    const code = req.query.code as string;
    console.log('req.query.code = ' + code);
    console.log('\n');

    const token = await this.authService.accessToken(code);
    console.log(token);
    console.log('\n');

    const user = await this.authService.get42User(
      token.access_token,
    );
    console.log(user.email);
    console.log('\n');

    this.authService.createCookies(res, token);

    // this.authService.updateCookies(res, token, user);

    if (!user.email)
    {
      const user42 = await this.authService.create42User(token, user);
      res.redirect(`http://localhost:3000/login`);
    }
    else {
      this.authService.updateCookies(res, token, user);
      res.redirect(
        `http://localhost:3000/?token=${token.access_token}`,
      );
    }
  }

  @Get('42/logout')
  async logout( @Res() res: Response) {
    this.authService.deleteCookies(res);
    res.redirect(`http://localhost:3000/login`);
  }

}
