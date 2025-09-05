import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { AwsStationsService } from './aws-stations.service';
import { CreateAwsStationDto } from './dto/create-aws-station.dto';
import { UpdateAwsStationDto } from './dto/update-aws-station.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('aws-stations')
export class AwsStationsController {
  constructor(private readonly service: AwsStationsService) {}

  @Post()
  async create(@Body() dto: CreateAwsStationDto) {
    const created = await this.service.create(dto);
    const { id, ...rest } = created;
    return { message: 'Station successfully created', data: rest };
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async findAll(@Query('page') page = '1', @Query('perPage') perPage = '10') {
    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const skip = (pageNumber - 1) * perPageNumber;
    const data = await this.service.findMany(skip, perPageNumber);
    const total = await this.service.count();
    const totalPages = Math.ceil(total / perPageNumber);

    const filtered = data.map(({ id, ...rest }) => rest);

    return {
      message: 'All station data fetched successfully',
      data: filtered,
      total,
      page: pageNumber,
      perPage: perPageNumber,
      totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const station = await this.service.findOne(+id);
    if (!station)
      return { message: `Station with ID ${id} not found`, data: null };
    const { id: _, ...rest } = station;
    return { message: `Station ${id} data fetched successfully`, data: rest };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAwsStationDto) {
    const updated = await this.service.update(+id, dto);
    const { id: _, ...rest } = updated;
    return { message: `Station ${id} updated successfully`, data: rest };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(+id);
    const { id: _, ...rest } = deleted;
    return { message: `Station ${id} deleted successfully`, data: rest };
  }
}
