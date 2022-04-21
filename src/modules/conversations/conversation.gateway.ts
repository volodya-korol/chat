import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WSAuthGuard } from 'src/common/guards/auth.guard';
import { SocketWithUser } from 'src/common/types/request.type';
import { MembersService } from 'src/modules/members/members.service';
import { MessagesService } from '../messages/messages.service';

@UseGuards(WSAuthGuard)
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: true,
  },
})
export class ConversationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly membersService: MembersService,
  ) {}

  @SubscribeMessage('connect_to_conversation')
  async joinConversation(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody('conversationId') conversationId: number,
  ) {
    const { id: userId } = socket.user;
    const member = await this.membersService.get(userId, conversationId);
    const messages = await this.messagesService.findAll(conversationId);

    this.server.socketsJoin(String(conversationId));
    this.server.sockets
      .to(String(conversationId))
      .emit('receive_all_message', [messages, { hello: 0 }, { hello: 0 }]);
    return member;
  }
}
