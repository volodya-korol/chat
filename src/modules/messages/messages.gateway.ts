import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SocketWithUser } from 'src/common/types/request.type';
import { MembersService } from '../members/members.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@UseGuards(AuthGuard)
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: true,
  },
})
export class MessagesGateway {
  // @WebSocketServer()
  // server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly membersService: MembersService,
  ) {}

  @SubscribeMessage('send_message')
  async sendMessage(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() { message, conversationId, options }: CreateMessageDto,
  ) {
    const { id: userId } = socket.user;
    const author = await this.membersService.get(userId, conversationId);
    const newMessage = await this.messagesService.create({
      message,
      memberId: author.id,
      connversationId: conversationId,
    });

    socket.to(String(conversationId)).emit('receive_message', newMessage);
    if (options.deleteAt)
      this.messagesService.delete(newMessage.id, options.deleteAt);
    return newMessage;
  }

  @SubscribeMessage('read_all')
  async readMessage(
    @MessageBody() { conversationId }: { conversationId: number },
  ) {
    return this.messagesService.read(conversationId);
  }

  @SubscribeMessage('delete_message')
  async deleteMessage(@MessageBody() { messageId }: { messageId: number }) {
    this.messagesService.delete(messageId);
  }

  @SubscribeMessage('toggle_write')
  async toggleWrite(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() { conversationId, isWrite }: any,
  ) {
    const { id: userId } = socket.user;
    const author = await this.membersService.get(userId, conversationId);
    if (isWrite) {
      socket.to(conversationId).emit('start_write', author);
    } else {
      socket.to(conversationId).emit('stop_write', author);
    }
  }
}
