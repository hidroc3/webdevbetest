import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { AwlrLogsService } from './awlr-logs.service';
import { CreateAwlrLogDto } from './dto/create-awlr-log.dto';
import { UpdateAwlrLogDto } from './dto/update-awlr-log.dto';

@Controller('awlr-logs')
export class AwlrLogsController {
  constructor(private readonly service: AwlrLogsService) {}

  @Post()
  async create(@Body() dto: CreateAwlrLogDto) {
    const data = await this.service.create(dto);
    return { message: 'Log created successfully', data };
  }

  @Get()
  async findFiltered(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.service.findFiltered(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      startDate,
      endDate,
    );
    return { message: 'Data fetched successfully', ...result };
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateAwlrLogDto) {
    const data = await this.service.updateById(+id, dto);
    return { message: `Log ${id} updated successfully`, data };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const data = await this.service.deleteById(+id);
    return { message: `Log ${id} deleted successfully`, data };
  }

  @Delete()
  async deleteAll() {
    const data = await this.service.deleteAll();
    return { message: 'All logs deleted successfully', data };
  }
}
