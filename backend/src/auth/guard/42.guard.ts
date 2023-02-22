import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    constructor() {
		super();
	}
}