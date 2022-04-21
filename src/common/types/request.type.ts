import { Member, User } from '@prisma/client';
import { Request } from 'express';
import { Socket } from 'socket.io';

export interface SocketWithUser extends Socket {
  user: User;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithMember extends Request {
  member: Member;
}
