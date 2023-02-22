import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/42.strategy';

@Module({
	imports: [JwtModule.register({}), PassportModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, FortyTwoStrategy],
})
export class AuthModule{}