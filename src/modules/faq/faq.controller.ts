import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  async create(@Body() createFaqDto: CreateFaqDto) {
    const data = await this.faqService.create(createFaqDto);
    return {
      message: 'Faq created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.faqService.findAll();
    return {
      message: 'Data faq successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.faqService.findOne(+id);
    return {
      message: 'Faq retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    const data = await this.faqService.update(+id, updateFaqDto);
    return {
      message: 'Faq updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.faqService.remove(+id);
    return {
      message: 'Faq deleted successfully',
      data,
    };
  }
}
