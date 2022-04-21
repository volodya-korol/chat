import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
  getByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  getAll() {
    return this.prismaService.user.findMany({
      where: {},
      select: { email: true, id: true, isOnline: true, name: true },
    });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
      select: { email: true, id: true, isOnline: true, name: true },
    });
  }

  getByJwt(JwtToken: string) {
    const { userId }: any = this.jwtService.decode(JwtToken);
    return this.getById(userId);
  }

  toggleOnline(userId: number, flag: boolean) {
    this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isOnline: flag,
      },
    });
  }
}
