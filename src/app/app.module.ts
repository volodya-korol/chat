import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard, RolesGuard } from 'src/common/guards/role.guard';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { MembersModule } from 'src/modules/members/members.module';
import { MessagesModule } from 'src/modules/messages/messages.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ProviderModule } from 'src/providers/provider.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ProviderModule,
    UsersModule,
    MembersModule,
    ConversationsModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    
  ],
})
export class AppModule {}
