import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { AppSettingEntity } from './entities/app-setting.entitiy';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class AppSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    dto: UpsertSettingDto,
    file?: Express.Multer.File,
  ): Promise<AppSettingEntity> {
    const existing = await this.prisma.appSetting.findUnique({
      where: { key: dto.key },
    });

    let value: string | null = dto.value ?? null;

    if (dto.type === 'file') {
      if (file) {
        value = `/files/${file.filename}`;
        if (existing?.value && existing.value.startsWith('/files/')) {
          const oldFileName = existing.value.replace('/files/', '');
          const oldPath = join(
            process.cwd(),
            'storage',
            'uploads',
            oldFileName,
          );
          if (existsSync(oldPath)) {
            unlinkSync(oldPath);
          }
        }
      } else {
        value = existing?.value ?? null;
      }
    }

    const data = await this.prisma.appSetting.upsert({
      where: { key: dto.key },
      update: { type: dto.type, value },
      create: { key: dto.key, type: dto.type, value },
    });

    return data;
  }

  async getAll(): Promise<AppSettingEntity[]> {
    const data = await this.prisma.appSetting.findMany({
      orderBy: { key: 'asc' },
    });
    return data;
  }

  async getByKey(key: string): Promise<AppSettingEntity> {
    const data = await this.prisma.appSetting.findUnique({
      where: { key: key },
    });
    if (!data) throw new NotFoundException('Key not found');
    return data;
  }

  async remove(key: string): Promise<AppSettingEntity> {
    const existing = await this.prisma.appSetting.findUnique({
      where: { key: key },
    });

    if (!existing) {
      throw new BadRequestException('Not Found');
    }
    if (existing.type === 'file' && existing.value) {
      const oldFileName = existing.value.replace('/files/', '');
      const oldPath = join(process.cwd(), 'storage', 'uploads', oldFileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }

    const data = await this.prisma.appSetting.delete({
      where: { key: key },
    });
    return data;
  }
}
