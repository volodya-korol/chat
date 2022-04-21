import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  conversationId: number;

  @IsObject()
  options?: {
    deleteAt?: Date;
  };
}
