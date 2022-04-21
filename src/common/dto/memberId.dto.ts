import { IsNotEmpty, IsNumber } from 'class-validator';

export class MemberIdDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;
}
