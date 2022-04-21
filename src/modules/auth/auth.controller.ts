import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RequestWithUser } from 'src/common/types/request.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  auth(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(loginDto);
    const cookie = this.authService.getCookieWithJwt(user.id);
    req.res.setHeader('Set-Cookie', [cookie]);
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    const cookie = this.authService.removeCookieWithJwt();
    req.res.setHeader('Set-Cookie', [cookie]);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registerDto);
    const cookie = this.authService.getCookieWithJwt(user.id);
    req.res.setHeader('Set-Cookie', [cookie]);
    return user;
  }
}
