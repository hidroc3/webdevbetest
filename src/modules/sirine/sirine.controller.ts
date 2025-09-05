import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { SirineService } from './sirine.service';
import { CreateSirineDto } from './dto/create-sirine.dto';
import { UpdateSirineDto } from './dto/update-sirine.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('sirine') 
@ApiBearerAuth('access-token') 
@Controller('sirine')
@UseGuards(JwtGuard, AccessGuard)
export class SirineController {
  constructor(
    private readonly service: SirineService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @Permission('create sirine')
  create(@Body() dto: CreateSirineDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  @Permission('create sirine')
  createMany(@Body() dtos: CreateSirineDto[]) {
    return this.service.createMany(dtos);
  }

  @Get()
  @Permission('data sirine')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permission('detail sirine')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @Permission('update sirine')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSirineDto) {
    return this.service.update(BigInt(id), dto);
  }

  @Delete(':id')
  @Permission('delete sirine')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(BigInt(id));
  }

  @Post(':id/on')
  @HttpCode(200)
  @Permission('update sirine')
  async turnOnSirine(@Param('id', ParseIntPipe) id: number) {
    const sirine = await this.service.findOne(BigInt(id));

    if (!sirine?.on_control_url || !sirine?.on_control_state_id) {
      throw new BadRequestException(
        'Kontrol ON tidak tersedia untuk sirine ini.',
      );
    }

    await this.sendControlCommand(
      sirine.on_control_url,
      sirine.on_control_state_id,
    );

    const updated = await this.service.update(BigInt(id), {
      is_sirine_on: true,
    });

    return {
      id: updated.id.toString(),
      name: updated.name,
      status: 'on',
      is_sirine_on: true,
      updated_at: updated.updated_at,
      message: `✅ Sirine "${updated.name}" berhasil dinyalakan.`,
    };
  }

  @Post(':id/off')
  @HttpCode(200)
  @Permission('update sirine')
  async turnOffSirine(@Param('id', ParseIntPipe) id: number) {
    const sirine = await this.service.findOne(BigInt(id));

    if (!sirine?.off_control_url || !sirine?.off_control_state_id) {
      throw new BadRequestException(
        'Kontrol OFF tidak tersedia untuk sirine ini.',
      );
    }

    await this.sendControlCommand(
      sirine.off_control_url,
      sirine.off_control_state_id,
    );

    const updated = await this.service.update(BigInt(id), {
      is_sirine_on: false,
    });

    return {
      id: updated.id.toString(),
      name: updated.name,
      status: 'off',
      is_sirine_on: false,
      updated_at: updated.updated_at,
      message: `❌ Sirine "${updated.name}" berhasil dimatikan.`,
    };
  }

  private async sendControlCommand(url: string, stateId: string) {
    const apiKey = this.config.get<string>('EAGLE_API_KEY');

    try {
      await lastValueFrom(
        this.http.post(
          url,
          { stateId },
          {
            headers: {
              'x-api-key': apiKey,
            },
          },
        ),
      );
    } catch (err) {
      throw new BadRequestException(
        `Gagal mengirim perintah ke sirine: ${err.message}`,
      );
    }
  }
}
