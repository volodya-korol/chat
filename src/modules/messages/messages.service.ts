import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(
    private prismaService: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  getOne(messageId: number) {
    return this.prismaService.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async create({
    connversationId,
    memberId,
    message,
  }: {
    message: string;
    memberId: number;
    connversationId: number;
  }) {
    return this.prismaService.message.create({
      data: {
        content: message,
        authorId: memberId,
        conversationId: connversationId,
      },
    });
  }

  read(conversationId: number) {
    return this.prismaService.message.updateMany({
      where: {
        conversationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  delete(messageId: number, deleteAt?: Date) {
    const deleteMessage = () =>
      this.prismaService.message.update({
        where: {
          id: messageId,
        },
        data: {
          isDelete: true,
        },
      });

    if (deleteAt) {
      const deleting = new CronJob(deleteAt, deleteMessage);
      this.schedulerRegistry.addCronJob(`${messageId}-delete`, deleting);
      deleting.start();
      return `message with ${messageId} will be delete at ${deleteAt} `;
    } else {
      return deleteMessage;
    }
  }

  findAll(
    conversationId: number,
    { page = 0, size = 20 }: { page?: number; size?: number } = {},
  ) {
    return this.prismaService.message.findMany({
      where: {
        conversationId: conversationId,
        isDelete: false,
      },
      include: {
        Author: {},
      },
      take: size,
      skip: size * page,
    });
  }
}
