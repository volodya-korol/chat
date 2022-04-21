import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { MembersService } from '../members/members.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { ConversationsGateway } from './conversation.gateway';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ConversationsController],
  providers: [
    PrismaService,
    MessagesService,
    UsersService,
    MembersService,
    ConversationsService,
    ConversationsGateway,
    MembersService
  ],
})
export class ConversationsModule {}
