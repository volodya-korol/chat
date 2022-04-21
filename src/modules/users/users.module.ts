import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtStrategy } from 'src/common/strategy/auth.strategy';
import { PrismaService } from './../../providers/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UsersController],
  providers: [PrismaService, UsersGateway, UsersService, AuthJwtStrategy],
})
export class UsersModule {}
