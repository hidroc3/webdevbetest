import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Sih3ItemService } from './sih3-item.service';
import { CreateSih3ItemDto } from './dto/create-sih3-item.dto';
import { UpdateSih3ItemDto } from './dto/update-sih3-item.dto';

@Controller('sih3-item')
export class Sih3ItemController {
  constructor(private readonly sih3ItemService: Sih3ItemService) {}

  @Post()
  async create(@Body() createSih3ItemDto: CreateSih3ItemDto) {
    const data = await this.sih3ItemService.create(createSih3ItemDto);
    return {
      message: 'Sih3 item created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.sih3ItemService.findAll();
    return {
      message: 'Data sih3 item successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.sih3ItemService.findOne(+id);
    return {
      message: 'Sih3 item retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSih3ItemDto: UpdateSih3ItemDto,
  ) {
    const data = await this.sih3ItemService.update(+id, updateSih3ItemDto);
    return {
      message: 'Sih3 item updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.sih3ItemService.remove(+id);
    return {
      message: 'Sih3 item deleted successfully',
      data,
    };
  }
}
