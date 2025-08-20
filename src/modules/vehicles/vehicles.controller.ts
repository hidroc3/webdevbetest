import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('vehicles')
@UseGuards(JwtGuard, AccessGuard)
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Post()
  @Permission('create vehicle')
  async create(@Body() dto: CreateVehicleDto) {
    const data = await this.service.create(dto);
    return { message: 'Vehicle created successfully', data };
  }

  @Get()
  @Permission('data vehicle')
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'All vehicles retrieved', data };
  }

  @Get(':id')
  @Permission('detail vehicle')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(BigInt(id));
    return { message: 'Vehicle retrieved', data };
  }

  @Patch(':id')
  @Permission('update vehicle')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
  ) {
    const data = await this.service.update(BigInt(id), dto);
    return { message: 'Vehicle updated successfully', data };
  }

  @Delete(':id')
  @Permission('delete vehicle')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.remove(BigInt(id));
    return { message: 'Vehicle deleted successfully', data };
  }
}
