import { PrismaService } from './../prisma/prisma.service';
import { Body, Controller, Post, Get, ParseIntPipe, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, Auth42Dto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private prismaService: PrismaService) {}

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
    // console.log('req.query.code = ' + code);
    // console.log('\n');

    const token = await this.authService.accessToken(code);
    console.log(token);
    console.log('\n');

    const user = await this.authService.get42User(
      token.access_token,
    );
    // console.log(user.email);
    // console.log('\n');

    if (token)
    {
      // console.log("Token exists, so we create cookies! \n\n");
      this.authService.createCookies(res, token);
    }

    // this.authService.updateCookies(res, token, user);

    if (!user.email)
    {
      // const user42 = await this.authService.create42User(token, user);
      // if (user42)
      res.redirect(`http://localhost:3000/login`);
    }
    else {
      
      const userExist = await this.authService.findUserByEmail(user.email);
      if (!userExist)
      {
        console.log("User does not exist, so we create it! \n\n");
        const user42 = await this.authService.create42User(token, user);
      }
      else
      {
        console.log("User already exists, so we update it! \n\n");
        this.authService.updateCookies(res, token, user);
      }

      const updatedUser = await this.authService.findUserByEmail(user.email);

      // this.authService.updateCookies(res, token, user);
      if (updatedUser.twoFactorActivated === false)
      {
        // console.log("Hello 1\n");
        res.redirect(
          `http://localhost:3000/homepage`,
          );
      }
      else if (updatedUser.twoFactorActivated === true)
      {
        // console.log("Hello 2\n");
        res.redirect(
          `http://localhost:3000/2fa/verification`,
          );
      }
      else
      {
        // console.log("Hello 3\n");
      }

      return { token: token, user: user };
    }
  }

  @Get('token')
  async getToken2( @Req() req: Request, @Res() res: Response) {
    // const user = await this.prismaService.user.findUnique({
    //   where: {
    //     email: req.body.email,
    //   },
    // })

    const test = req.cookies.token;
    
    console.log("Inside get token2 fucntion: ", test);
    return;
  }

  @Get('42/logout')
  async logout( @Res() res: Response) {
    this.authService.deleteCookies(res);
    res.redirect(`http://localhost:3000/login`);
  }

  @Get('2fa/status')
  async get2FAStatus(@Req() req: Request) {
    return this.authService.get2FAStatus(req);
  }

  @Post('2fa/enable')
  async enable2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.enable2FA(req, res);
  }

  @Post('2fa/activated')
  async activate2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.activate2FA(req, res);
  }

  // @Post('2fa/disable')
  // async disable2FA(@Req() req: Request, @Res() res: Response) {
  //   return this.authService.disable2FA(req, res);
  // }

  @Post('2fa/generate')
  async generate2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.generate2FA(req, res);
  }

  @Get('2fa/qrcode')
  async generateQrCodeDataURL(otpAuthUrl: any) {
    return this.authService.generateQrCodeDataURL(otpAuthUrl);
  }

  @Post('2fa/verify')
  async verify2FA(@Req() req: Request) {
    return this.authService.verify2FA(req);
  }
}
