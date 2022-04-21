import { RolesT } from 'src/common/types/role.type';

export class CreateMemberDto {
  role: RolesT;
  userId: number;
  conversationId: number;
}
