import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConversationIdDto {
  @IsNotEmpty()
  @IsNumber()
  conversationId: number;
}
