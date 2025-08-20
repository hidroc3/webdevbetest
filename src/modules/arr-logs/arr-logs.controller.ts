import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ArrLogsService } from './arr-logs.service';
import { CreateArrLogDto } from './dto/create-arr-log.dto';
import { UpdateArrLogDto } from './dto/update-arr-log.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('arr-logs')
@UseGuards(JwtGuard, AccessGuard)
export class ArrLogsController {
  constructor(private readonly arrLogsService: ArrLogsService) {}

  @Post()
  @Permission('create arr log')
  async create(@Body() dto: CreateArrLogDto) {
    const data = await this.arrLogsService.create(dto);
    return { message: 'Log created successfully', data };
  }

  @Get()
  @Permission('data arr log')
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
  @Permission('update arr log')
  async updateById(@Param('id') id: string, @Body() dto: UpdateArrLogDto) {
    const data = await this.arrLogsService.updateById(+id, dto);
    return { message: `Log ${id} updated successfully`, data };
  }

  @Delete(':id')
  @Permission('delete arr log')
  async deleteById(@Param('id') id: string) {
    const data = await this.arrLogsService.deleteById(+id);
    return { message: `Log ${id} deleted successfully`, data };
  }

  @Delete()
  @Permission('delete arr log')
  async deleteAll() {
    const data = await this.arrLogsService.deleteAll();
    return { message: 'All logs deleted successfully', data };
  }

  @Get('sum/hour')
  @Permission('data arr log')
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
  @Permission('data arr log')
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
