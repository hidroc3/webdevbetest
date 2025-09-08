import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { AppSettingEntity } from './entities/app-setting.entitiy';

@Injectable()
export class AppSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpsertSettingDto): Promise<AppSettingEntity> {
    const data = await this.prisma.appSetting.upsert({
      where: { key: dto.key },
      update: { type: dto.type, value: dto.value },
      create: { key: dto.key, type: dto.type, value: dto.value },
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
    const data = await this.prisma.appSetting.delete({
      where: { key: key },
    });
    return data;
  }
}
