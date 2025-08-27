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
import { ArrLogsService } from './arr-logs.service';
import { CreateArrLogDto } from './dto/create-arr-log.dto';
import { UpdateArrLogDto } from './dto/update-arr-log.dto';

@Controller('arr-logs')
export class ArrLogsController {
  constructor(private readonly arrLogsService: ArrLogsService) {}

  @Post()
  async create(@Body() dto: CreateArrLogDto) {
    const data = await this.arrLogsService.create(dto);
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
    const result = await this.arrLogsService.findFiltered(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      startDate,
      endDate,
    );
    return { message: 'Data fetched successfully', ...result };
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateArrLogDto) {
    const data = await this.arrLogsService.updateById(+id, dto);
    return { message: `Log ${id} updated successfully`, data };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const data = await this.arrLogsService.deleteById(+id);
    return { message: `Log ${id} deleted successfully`, data };
  }

  @Delete()
  async deleteAll() {
    const data = await this.arrLogsService.deleteAll();
    return { message: 'All logs deleted successfully', data };
  }

  @Get('sum/hour')
  async sumRainfallPerHour(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.arrLogsService.sumRainfallPerHour(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      startDate,
      endDate,
    );
    return { message: 'Sum rainfall per hour fetched successfully', ...data };
  }

  @Get('sum/day')
  async sumRainfallPerDay(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.arrLogsService.sumRainfallPerDay(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      startDate,
      endDate,
    );
    return { message: 'Sum rainfall per day fetched successfully', ...data };
  }
}
