import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { MembersService } from '../members/members.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SearchingParam } from './types/searching-param.type';

@Injectable()
export class ConversationsService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private membersService: MembersService,
  ) {}

  async create(
    creatorId: number,
    { description, name, users }: CreateConversationDto,
  ) {
    const admin = { userId: creatorId, role: 'admin' };
    const members = users.map((id) => ({ userId: id, role: 'member' }));

    return this.prismaService.conversation.create({
      data: {
        name,
        description,
        Members: { create: [admin, ...members] },
      },
      include: { Members: {} },
    });
  }

  getUserConversations(userId: number) {
    return this.prismaService.conversation.findMany({
      where: {
        Members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async getConversationFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie || '';
    const { conversationId = '' } = parse(cookie);
    if (!conversationId) throw new WsException('Please joit to conversation');
    const conversation = this.findOne(+conversationId);
    return conversation;
  }

  findOne(id: number) {
    console.log(id);

    return this.prismaService.conversation.findFirst({
      where: { id },
      include: {
        Members: {},
        Atachments: {},
        Messages: {
          take: 20,
        },
      },
    });
  }

  async getByMemberId(memberId: number) {
    const member = await this.prismaService.member.findUnique({
      where: {
        id: memberId,
      },
      include: {
        Conversation: {},
      },
    });
    return member.Conversation;
  }

  async join(param: SearchingParam) {
    if (await this.isExistMember(param))
      throw new HttpException('member was joined', HttpStatus.BAD_REQUEST);

    const { conversationId, userId } = param;
    return this.prismaService.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        Members: {
          create: {
            userId,
            role: 'member',
          },
        },
      },
      include: {
        Members: {},
      },
    });
  }

  addMember(conversationId, userId) {
    this.membersService.create(conversationId, userId);
  }

  removeMember(memberId) {
    return this.membersService.delete(memberId);
  }

  unNotificated(param: SearchingParam) {
    return this.memberNtification(param, false);
  }

  notificated(param: SearchingParam) {
    return this.memberNtification(param, true);
  }

  update({ conversatonId, ...data }: UpdateConversationDto) {
    this.prismaService.conversation.update({
      where: { id: conversatonId },
      data,
    });
  }

  private memberNtification(
    { conversationId, userId }: SearchingParam,
    notificationFlag: boolean,
  ) {
    return this.prismaService.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        Members: {
          update: {
            where: {
              id: userId,
            },
            data: {
              isNotificated: notificationFlag,
            },
          },
        },
      },
    });
  }

  getCookieWithJwt(conversationId: number) {
    const token = this.jwtService.sign(
      { conversationId },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: `${this.configService.get('JWT_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
    return `ConversationId=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  private async isExistMember({ conversationId, userId }: SearchingParam) {
    const member = await this.prismaService.conversation.findFirst({
      where: {
        id: conversationId,
        Members: {
          some: {
            userId,
          },
        },
      },
    });

    return member ? true : false;
  }
}
