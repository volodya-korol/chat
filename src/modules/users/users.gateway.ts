import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { UsersService } from './users.service';


@WebSocketGateway({
  cors: {
    credentials: true,
    origin: true,
  },
})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private usersService: UsersService) {}

  async handleConnection(client: Socket) {
    const { Authentication } = parse(client.handshake.headers.cookie);
    const user = await this.usersService.getByJwt(Authentication);
    this.usersService.toggleOnline(user.id, true);
  }

  async handleDisconnect(client: Socket) {
    const { Authentication } = parse(client.handshake.headers.cookie);
    const user = await this.usersService.getByJwt(Authentication);
    this.usersService.toggleOnline(user.id, false);
  }
}
