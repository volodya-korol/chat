import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { parse } from 'cookie';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          console.log(request?.cookies?.Authentication ||
            parse(request?.handshake?.headers?.cookie || '').Authentication ||
            '');

          return (
            request?.cookies?.Authentication ||
            parse(request?.handshake?.headers?.cookie || '').Authentication ||
            ''
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { userId: number }) {
    return this.usersService.getById(payload.userId);
  }
}
