import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemberIdDto } from 'src/common/dto/memberId.dto';
import { UserIdDto } from 'src/common/dto/userId.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  RequestWithMember,
  RequestWithUser,
} from 'src/common/types/request.type';
import { ConversationIdDto } from './../../common/dto/conversationId.dto';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversations')
@ApiTags('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserConversations(@Req() req: RequestWithUser) {
    return this.conversationsService.getUserConversations(req.user.id);
  }

  @Get(':conversationId')
  find(@Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.conversationsService.findOne(conversationId);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: RequestWithUser,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(req.user.id, createConversationDto);
  }

  @Post('join')
  @UseGuards(AuthGuard)
  join(
    @Req() req: RequestWithUser,
    @Body('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.conversationsService.join({
      userId: req.user.id,
      conversationId,
    });
  }

  @Post('leave')
  @RolesGuard()
  leave(@Req() req: RequestWithMember) {
    return this.conversationsService.removeMember(req.member.id);
  }

  @Post('addMember')
  @RolesGuard(['admin', 'superAdmin'])
  addMember(
    @Body()
    { conversationId, userId }: UserIdDto & ConversationIdDto,
  ) {
    return this.conversationsService.addMember(conversationId, userId);
  }

  @Post('removeMember')
  @RolesGuard(['admin', 'superAdmin'])
  romoveMember(@Body() { memberId }: MemberIdDto) {
    this.conversationsService.removeMember(memberId);
  }

  @Put()
  @RolesGuard(['admin', 'superAdmin'])
  updateConversation(@Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationsService.update(updateConversationDto);
  }
}
