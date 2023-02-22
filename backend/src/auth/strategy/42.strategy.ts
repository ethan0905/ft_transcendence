import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { FortyTwoUser } from '../interfaces/42user.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: "u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/42/callback",
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FortyTwoUser,
  ): FortyTwoUser {
    return profile;
  }
}