import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await this.usersService.getByEmail(email);

      await this.verifyPassword(password, user.password);

      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credential provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  async register(registerDto: RegisterDto) {
    const { password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return user;
  }

  private async verifyPassword(authorPassword: string, HashedPassword: string) {
    const result = await bcrypt.compare(authorPassword, HashedPassword);
    if (!result)
      throw new HttpException(
        'Wrong password provided',
        HttpStatus.BAD_REQUEST,
      );
  }

  getCookieWithJwt(userId: number) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: `${this.configService.get('JWT_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_TOKEN_EXPIRATION_TIME',
    )}`;
  }
  removeCookieWithJwt() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=;`;
  }
}
