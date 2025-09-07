import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AppSetting } from '@prisma/client';
import { UpsertSettingDto } from './dto/upsert-setting';

@Injectable()
export class AppSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpsertSettingDto): Promise<AppSetting> {
    const data = await this.prisma.appSetting.upsert({
      where: { key: dto.key },
      update: { type: dto.type, value: dto.value },
      create: { key: dto.key, type: dto.type, value: dto.value },
    });
    return data;
  }

  async getAll(): Promise<AppSetting[]> {
    const data = (await this.prisma.appSetting.findMany({
      orderBy: { key: 'asc' },
    })) as AppSetting[];

    return data;
  }

  async getByKey(key: string): Promise<AppSetting> {
    const data = await this.prisma.appSetting.findUnique({
      where: { key: key },
    });
    if (!data) throw new NotFoundException('Key not found');
    return data;
  }

  async remove(key: string): Promise<AppSetting> {
    const data = await this.prisma.appSetting.delete({
      where: { key: key },
    });
    return data;
  }
}
