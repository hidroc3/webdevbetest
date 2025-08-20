import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AwsLogsService } from './aws-logs.service';
import { CreateAwsLogDto } from './dto/create-aws-log.dto';
import { UpdateAwsLogDto } from './dto/update-aws-log.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('aws-logs')
@UseGuards(JwtGuard, AccessGuard)
export class AwsLogsController {
  constructor(private readonly service: AwsLogsService) {}

  @Post()
  @Permission('create aws log')
  async create(@Body() dto: CreateAwsLogDto) {
    const created = await this.service.create(dto);
    const { id, ...rest } = created;
    return {
      message: 'Log successfully created',
      data: rest,
    };
  }

  @Get()
  @Permission('data aws log')
  async findAllToday() {
    const logs = await this.service.findAllToday();
    const filtered = logs.map(({ id, ...rest }) => rest);
    return {
      message: "Today's data fetched successfully (WIB)",
      data: filtered,
    };
  }

  @Get('all')
  @Permission('data aws log')
  async findAll() {
    const logs = await this.service.findAll();
    const filtered = logs.map(({ id, ...rest }) => rest);
    return {
      message: 'All data fetched successfully',
      data: filtered,
    };
  }

  @Get('station/:station_id')
  @Permission('data aws log')
  async findTodayByStation(@Param('station_id') station_id: string) {
    const logs = await this.service.findTodayByStationId(+station_id);
    const filtered = logs.map(({ id, ...rest }) => rest);
    return {
      message: `Today's data fetched for station ${station_id} (WIB)`,
      data: filtered,
    };
  }

  @Get('station/:station_id/all')
  @Permission('data aws log')
  async findAllByStation(@Param('station_id') station_id: string) {
    const logs = await this.service.findAllByStationId(+station_id);
    const filtered = logs.map(({ id, ...rest }) => rest);
    return {
      message: `All data fetched for station ${station_id}`,
      data: filtered,
    };
  }

  @Patch('station/:station_id')
  @Permission('update aws log')
  async update(
    @Param('station_id') station_id: string,
    @Body() dto: UpdateAwsLogDto,
  ) {
    const result = await this.service.updateByStationId(+station_id, dto);
    return {
      message: `Logs successfully updated for station ${station_id}`,
      data: result,
    };
  }

  @Delete('station/:station_id')
  @Permission('delete aws log')
  async remove(@Param('station_id') station_id: string) {
    const result = await this.service.removeByStationId(+station_id);
    return {
      message: `Logs successfully deleted for station ${station_id}`,
      data: result,
    };
  }
}
