import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('reports')
@UseGuards(JwtGuard, AccessGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post()
  @Permission('create report')
  async create(@Body() dto: CreateReportDto) {
    const data = await this.service.create(dto);
    return { message: 'Report created successfully', data };
  }

  @Get()
  @Permission('data report')
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'All reports retrieved', data };
  }

  @Get(':id')
  @Permission('detail report')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id);
    return { message: 'Report retrieved', data };
  }

  @Patch(':id')
  @Permission('update report')
  async update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    const data = await this.service.update(+id, dto);
    return { message: 'Report updated successfully', data };
  }

  @Delete(':id')
  @Permission('delete report')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(+id);
    return { message: 'Report deleted successfully', data };
  }
}
