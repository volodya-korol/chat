import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as authGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard extends authGuard('auth') {
  handleRequest(err, user) {
    console.log(user);

    if (err || !user) throw new UnauthorizedException('Unawtorizated');
    return user;
  }
}

@Injectable()
export class WSAuthGuard extends authGuard('auth') {
  handleRequest(err, user) {
    if (err || !user) throw new WsException('Unawtorizated');
    return user;
  }
}
