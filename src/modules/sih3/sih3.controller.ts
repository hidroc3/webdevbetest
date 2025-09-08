import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Sih3Service } from './sih3.service';
import { CreateSih3Dto } from './dto/create-sih3.dto';
import { UpdateSih3Dto } from './dto/update-sih3.dto';

@Controller('sih3')
export class Sih3Controller {
  constructor(private readonly sih3Service: Sih3Service) {}

  @Post()
  async create(@Body() createSih3Dto: CreateSih3Dto) {
    const data = await this.sih3Service.create(createSih3Dto);
    return {
      message: 'Sih3 created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.sih3Service.findAll();
    return {
      message: 'Data sih3 successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.sih3Service.findOne(+id);
    return {
      message: 'Sih3 retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSih3Dto: UpdateSih3Dto) {
    const data = await this.sih3Service.update(+id, updateSih3Dto);
    return {
      message: 'Sih3 updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.sih3Service.remove(+id);
    return {
      message: 'Sih3 deleted successfully',
      data,
    };
  }
}
