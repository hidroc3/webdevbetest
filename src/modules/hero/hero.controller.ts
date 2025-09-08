import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UploadFile } from '@/common/decorators/upload.decorator';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @UploadFile('file', ['image/jpeg', 'image/png'], 2)
  async create(
    @Body() createHeroDto: CreateHeroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.heroService.create(createHeroDto, file);
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
  @UploadFile('file', ['image/jpeg', 'image/png'], 2)
  async update(
    @Param('id') id: string,
    @Body() updateHeroDto: UpdateHeroDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.heroService.update(+id, updateHeroDto, file);
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
