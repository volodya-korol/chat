import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { MembersService } from './members.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [PrismaService, MembersService],
})
export class MembersModule {}
