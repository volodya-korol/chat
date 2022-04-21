import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembersService } from 'src/modules/members/members.service';
import { RolesT } from '../types/role.type';
import { AuthGuard } from './auth.guard';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private membersService: MembersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles: RolesT[] | RolesT = this.reflector.get(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const { user, body } = request;

    if (!body.conversationId)
      throw new BadRequestException('provide conversationId in body');

    const member = await this.membersService.get(user.id, body.conversationId);

    const isAccess = Array.isArray(roles)
      ? roles.some((role) => member.role === role)
      : member.role === roles;

    if (!isAccess) throw new ForbiddenException(`you must be ${roles}`);

    request.member = member;
    return true;
  }
}
export function RolesGuard(
  roles: RolesT[] = ['member', 'admin', 'superAdmin'],
) {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata('roles', roles),
    UseGuards(RoleGuard),
  );
}

// handleRequest(err, member, info) {
// console.log({err, member,info});
// if (err || !member) throw new WsException('join to conversation');
// const memberRole = member.role;
// if (this.role === 'user') return member;
// if (memberRole === RolesE.superAdmin) return member;
// if (this.role === memberRole && memberRole === RolesE.admin) return member;
// if (this.role !== memberRole) throw new WsException(`You no ${this.role}`);
// return member;
// }
