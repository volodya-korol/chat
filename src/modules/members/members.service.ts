import { Injectable } from '@nestjs/common';
import { RolesE, RolesT } from 'src/common/types/role.type';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prismaService: PrismaService) {}

  async get(userId: number, conversationId: number) {
    const member = this.prismaService.member.findFirst({
      where: {
        conversationId: +conversationId,
        userId: +userId,
      },
      include: {
        User: {},
      },
    });
    return member;
  }

  getAll() {
    return this.prismaService.member.findMany();
  }

  getById(memberId: number) {
    return this.prismaService.member.findUnique({
      where: {
        id: memberId,
      },
      include: {
        User: {},
      },
    });
  }

  getByConversationId(conversationId: number, role?: RolesT) {
    return this.prismaService.member.findMany({
      where: {
        conversationId,
        role: role || null,
      },
      include: {
        User: {},
      },
    });
  }

  create(conversationId: number, users: number[]) {
    return this.prismaService.member.createMany({
      data: users.map((id) => ({
        userId: id,
        role: RolesE.member,
        conversationId,
      })),
      skipDuplicates: true,
    });
  }

  toggleNotification(memberId: number, flag: boolean) {
    return this.prismaService.member.update({
      where: {
        id: memberId,
      },
      data: {
        isNotificated: flag,
      },
    });
  }

  changeRole(memberId: number, role: RolesT) {
    return this.prismaService.member.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });
  }

  delete(memberId: number) {
    return this.prismaService.member.update({
      where: { id: memberId },
      data: { isDelete: true },
    });
  }
}
