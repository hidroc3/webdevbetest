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
import { ReportDetailsService } from './report-details.service';
import { CreateReportDetailDto } from './dto/create-report-detail.dto';
import { UpdateReportDetailDto } from './dto/update-report-detail.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('report-details')
@UseGuards(JwtGuard, AccessGuard)
export class ReportDetailsController {
  constructor(private readonly service: ReportDetailsService) {}

  @Post()
  @Permission('create report')
  async create(@Body() dto: CreateReportDetailDto) {
    const data = await this.service.create(dto);
    return { message: 'Report detail created successfully', data };
  }

  @Get()
  @Permission('data report')
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'All report details retrieved', data };
  }

  @Get(':id')
  @Permission('detail report')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id);
    return { message: 'Report detail retrieved', data };
  }

  @Patch(':id')
  @Permission('update report')
  async update(@Param('id') id: string, @Body() dto: UpdateReportDetailDto) {
    const data = await this.service.update(+id, dto);
    return { message: 'Report detail updated successfully', data };
  }

  @Delete(':id')
  @Permission('delete report')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(+id);
    return { message: 'Report detail deleted successfully', data };
  }
}
