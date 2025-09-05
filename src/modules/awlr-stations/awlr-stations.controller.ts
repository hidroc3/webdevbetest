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
import { AwlrStationsService } from './awlr-stations.service';
import { CreateAwlrStationDto } from './dto/create-awlr-station.dto';
import { UpdateAwlrStationDto } from './dto/update-awlr-station.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('awlr-stations')
export class AwlrStationsController {
  constructor(private readonly service: AwlrStationsService) {}

  @Post()
  async create(@Body() dto: CreateAwlrStationDto) {
    const created = await this.service.create(dto);
    const { id, ...rest } = created;
    return {
      message: 'Station successfully created',
      data: rest,
    };
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async findAll(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    const skip = (Number(page) - 1) * Number(perPage);
    const total = await this.service.count();
    const stations = await this.service.findMany(skip, Number(perPage));
    const filtered = stations.map(({ id, ...rest }) => rest);

    return {
      message: 'All station data fetched successfully',
      data: filtered,
      total,
      page: Number(page),
      perPage: Number(perPage),
      totalPages: Math.ceil(total / Number(perPage)),
    };
  }

  @Get(':id')
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
  async update(@Param('id') id: string, @Body() dto: UpdateAwlrStationDto) {
    const updated = await this.service.update(+id, dto);
    const { id: _, ...rest } = updated;
    return {
      message: `Station ${id} updated successfully`,
      data: rest,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(+id);
    const { id: _, ...rest } = deleted;
    return {
      message: `Station ${id} deleted successfully`,
      data: rest,
    };
  }
}
