import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async create(@Body() createContactUsDto: CreateContactUsDto) {
    const data = await this.contactUsService.create(createContactUsDto);
    return {
      message: 'Contact Us created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.contactUsService.findAll();
    return {
      message: 'Data contact us successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.contactUsService.findOne(+id);
    return {
      message: 'Contact Us retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ) {
    const data = await this.contactUsService.update(+id, updateContactUsDto);
    return {
      message: 'Contact Us updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.contactUsService.remove(+id);
    return {
      message: 'Contact Us deleted successfully',
      data,
    };
  }
}
