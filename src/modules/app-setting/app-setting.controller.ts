import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { AppSettingService } from './app-setting.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { UploadFile } from '@/common/decorators/upload.decorator';

@Controller('app-setting')
export class AppSettingController {
  constructor(private readonly service: AppSettingService) {}

  @Post()
  @UploadFile('file', ['image/jpeg', 'image/png'], 2)
  async save(
    @Body() dto: UpsertSettingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.service.upsert(dto, file);
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
