import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppSettingService } from './app-setting.service';
import { UpsertSettingDto } from './dto/upsert-setting';

@Controller('app-setting')
export class AppSettingController {
  constructor(private readonly service: AppSettingService) {}

  @Post()
  async save(@Body() dto: UpsertSettingDto) {
    const data = await this.service.upsert(dto);
    return {
      message: 'App Setting saved successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.service.getAll();
    return {
      message: 'All App Setting retrieved',
      data,
    };
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    const data = await this.service.getByKey(key);
    return {
      message: 'App Setting retrieved',
      data,
    };
  }

  @Delete(':key')
  async remove(@Param('key') key: string) {
    const data = await this.service.remove(key);
    return {
      message: 'App Setting deleted successfully',
      data,
    };
  }
}
