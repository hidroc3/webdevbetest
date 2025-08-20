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
import { AwsStationsService } from './aws-stations.service';
import { CreateAwsStationDto } from './dto/create-aws-station.dto';
import { UpdateAwsStationDto } from './dto/update-aws-station.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('aws-stations')
@UseGuards(JwtGuard, AccessGuard)
export class AwsStationsController {
  constructor(private readonly service: AwsStationsService) {}

  @Post()
  @Permission('create aws station')
  async create(@Body() dto: CreateAwsStationDto) {
    const created = await this.service.create(dto);
    const { id, ...rest } = created;
    return {
      message: 'Station successfully created',
      data: rest,
    };
  }

  @Get()
  @Permission('data aws station')
  async findAll() {
    const stations = await this.service.findAll();
    const filtered = stations.map(({ id, ...rest }) => rest);
    return {
      message: 'All station data fetched successfully',
      data: filtered,
    };
  }

  @Get(':id')
  @Permission('detail aws station')
  async findOne(@Param('id') id: string) {
    const station = await this.service.findOne(+id);
    if (!station) {
      return {
        message: `Station with ID ${id} not found`,
        data: null,
      };
    }
    const { id: _, ...rest } = station;
    return {
      message: `Station ${id} data fetched successfully`,
      data: rest,
    };
  }

  @Patch(':id')
  @Permission('update aws station')
  async update(@Param('id') id: string, @Body() dto: UpdateAwsStationDto) {
    const updated = await this.service.update(+id, dto);
    const { id: _, ...rest } = updated;
    return {
      message: `Station ${id} updated successfully`,
      data: rest,
    };
  }

  @Delete(':id')
  @Permission('delete aws station')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(+id);
    const { id: _, ...rest } = deleted;
    return {
      message: `Station ${id} deleted successfully`,
      data: rest,
    };
  }
}
