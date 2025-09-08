import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSih3ItemDto } from './dto/create-sih3-item.dto';
import { UpdateSih3ItemDto } from './dto/update-sih3-item.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Sih3ItemEntity } from './entities/sih3-item.entity';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class Sih3ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSih3ItemDto: CreateSih3ItemDto,
    file: Express.Multer.File,
  ): Promise<Sih3ItemEntity> {
    if (!file) {
      throw new BadRequestException(
        'File tidak ditemukan, pastikan form-data key = file',
      );
    }
    const data = await this.prisma.sih3Item.create({
      data: {
        logoPath: `/files/${file.filename}`,
        title: createSih3ItemDto.title,
        description: createSih3ItemDto.description,
      },
    });
    return data;
  }

  async findAll(): Promise<Sih3ItemEntity[]> {
    const data = await this.prisma.sih3Item.findMany();
    return data;
  }

  async findOne(id: number): Promise<Sih3ItemEntity> {
    const data = await this.prisma.sih3Item.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Not found');
    return data;
  }

  async update(
    id: number,
    updateSih3ItemDto: UpdateSih3ItemDto,
    file?: Express.Multer.File,
  ): Promise<Sih3ItemEntity> {
    const existing = await this.prisma.sih3Item.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('Not Found');
    }

    let logoPath = existing.logoPath;

    if (file) {
      logoPath = `/files/${file.filename}`;

      if (existing.logoPath) {
        const oldFileName = existing.logoPath.replace('/files/', '');
        const oldPath = join(process.cwd(), 'storage', 'uploads', oldFileName);
        if (existsSync(oldPath)) {
          unlinkSync(oldPath);
        }
      }
    }

    const data = await this.prisma.sih3Item.update({
      where: { id },
      data: {
        logoPath,
        title: updateSih3ItemDto.title ?? existing.title,
        description: updateSih3ItemDto.description ?? existing.description,
      },
    });

    return data;
  }

  async remove(id: number): Promise<Sih3ItemEntity> {
    const existing = await this.prisma.sih3Item.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('Not Found');
    }
    const data = await this.prisma.sih3Item.delete({ where: { id } });
    if (existing.logoPath) {
      const oldFileName = existing.logoPath.replace('/files/', '');
      const oldPath = join(process.cwd(), 'storage', 'uploads', oldFileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
    return data;
  }
}
