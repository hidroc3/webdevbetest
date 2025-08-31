import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactWaService } from './contact-wa.service';
import { CreateContactWaDto } from './dto/create-contact-wa.dto';
import { UpdateContactWaDto } from './dto/update-contact-wa.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('contact-wa') 
@ApiBearerAuth('access-token') 
@Controller('contact-wa')
@UseGuards(JwtGuard, AccessGuard)
export class ContactWaController {
  constructor(private readonly service: ContactWaService) {}

  @Post('bulk')
  @Permission('create contact wa')
  async createBulk(@Body() dtos: CreateContactWaDto[]) {
    const data = await this.service.createMany(dtos);
    return {
      message: 'Contacts successfully created in bulk',
      data,
    };
  }

  @Get()
  @Permission('data contact wa')
  async findAll() {
    const data = await this.service.findAll();
    return {
      message: 'All WhatsApp contacts fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Permission('detail contact wa')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id);
    return {
      message: `WhatsApp contact fetched for ID ${id}`,
      data,
    };
  }

  @Patch(':id')
  @Permission('update contact wa')
  async update(@Param('id') id: string, @Body() dto: UpdateContactWaDto) {
    const data = await this.service.update(+id, dto);
    return {
      message: `WhatsApp contact updated for ID ${id}`,
      data,
    };
  }

  @Delete(':id')
  @Permission('delete contact wa')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(+id);
    return {
      message: `WhatsApp contact deleted for ID ${id}`,
      data,
    };
  }
}
