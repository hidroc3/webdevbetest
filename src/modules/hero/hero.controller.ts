import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  async create(@Body() createHeroDto: CreateHeroDto) {
    const data = await this.heroService.create(createHeroDto);
    return {
      message: 'Hero created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.heroService.findAll();
    return {
      message: 'Data hero successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.heroService.findOne(+id);
    return {
      message: 'Hero retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    const data = await this.heroService.update(+id, updateHeroDto);
    return {
      message: 'Hero updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.heroService.remove(+id);
    return {
      message: 'Hero deleted successfully',
      data,
    };
  }
}
