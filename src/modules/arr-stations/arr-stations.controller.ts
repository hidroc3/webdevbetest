import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ArrStationsService } from './arr-stations.service';
import { CreateArrStationDto } from './dto/create-arr-station.dto';
import { UpdateArrStationDto } from './dto/update-arr-station.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('arr-stations')
export class ArrStationsController {
  private readonly logger = new Logger(ArrStationsController.name);

  constructor(private readonly arrStationsService: ArrStationsService) {}

  @Post()
  async create(@Body() dto: CreateArrStationDto) {
    try {
      const created = await this.arrStationsService.create(dto);
      const { id, ...rest } = created;
      return { message: 'Station successfully created', data: rest };
    } catch (err) {
      this.logger.error('Failed to create station', err);
      return { message: 'Internal server error', error: err.message };
    }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async findAll(@Query('page') page = '1', @Query('perPage') perPage = '10') {
    try {
      const pageNumber = Number(page) || 1;
      const perPageNumber = Number(perPage) || 10;
      const skip = (pageNumber - 1) * perPageNumber;

      const data = await this.arrStationsService.findMany(skip, perPageNumber);
      const total = await this.arrStationsService.count();
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
    } catch (err) {
      this.logger.error('Failed to fetch stations', err);
      return { message: 'Internal server error', error: err.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const station = await this.arrStationsService.findOne(+id);
      if (!station)
        return { message: `Station with ID ${id} not found`, data: null };
      const { id: _, ...rest } = station;
      return { message: `Station ${id} data fetched successfully`, data: rest };
    } catch (err) {
      this.logger.error(`Failed to fetch station ${id}`, err);
      return { message: 'Internal server error', error: err.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArrStationDto) {
    try {
      const updated = await this.arrStationsService.update(+id, dto);
      const { id: _, ...rest } = updated;
      return { message: `Station ${id} updated successfully`, data: rest };
    } catch (err) {
      this.logger.error(`Failed to update station ${id}`, err);
      return { message: 'Internal server error', error: err.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.arrStationsService.remove(+id);
      const { id: _, ...rest } = deleted;
      return { message: `Station ${id} deleted successfully`, data: rest };
    } catch (err) {
      this.logger.error(`Failed to delete station ${id}`, err);
      return { message: 'Internal server error', error: err.message };
    }
  }
}
