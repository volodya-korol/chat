import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MembersService } from '../members/members.service';
import { UsersService } from '../users/users.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  imports: [JwtModule.register({}), ScheduleModule.forRoot()],
  providers: [
    ConversationsService,
    PrismaService,
    UsersService,
    MembersService,
    MessagesGateway,
    MessagesService,
  ],
})
export class MessagesModule {}
