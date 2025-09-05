import { Body, Controller, Post } from '@nestjs/common';
import { ApiWaBlastingService } from './api-wa-blasting.service';
import { SendMessageDto } from './dto/send-message.dto';
@Controller('api-wa-blasting')
export class ApiWaBlastingController {
  constructor(private readonly service: ApiWaBlastingService) {}

  @Post('send-message')
  async sendMessage(@Body() dto: SendMessageDto) {
    await this.service.sendMessage(dto);
    return {
      message: 'Message sent successfully',
    };
  }
}
