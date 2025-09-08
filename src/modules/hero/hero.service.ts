import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { HeroEntity } from './entities/hero.entity';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createHeroDto: CreateHeroDto,
    file: Express.Multer.File,
  ): Promise<HeroEntity> {
    if (!file) {
      throw new BadRequestException(
        'File tidak ditemukan, pastikan form-data key = file',
      );
    }
    const data = await this.prisma.hero.create({
      data: {
        richText: createHeroDto.richText,
        ctaText: createHeroDto.ctaText,
        ctaLink: createHeroDto.ctaLink,
        imagePath: `/files/${file.filename}`,
      },
    });
    return data;
  }

  async findAll(): Promise<HeroEntity[]> {
    const data = await this.prisma.hero.findMany();
    return data;
  }

  async findOne(id: number): Promise<HeroEntity> {
    const data = await this.prisma.hero.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Not found');
    return data;
  }

  async update(
    id: number,
    updateHeroDto: UpdateHeroDto,
    file?: Express.Multer.File,
  ): Promise<HeroEntity> {
    const existing = await this.prisma.hero.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('Not Found');
    }

    let imagePath = existing.imagePath;

    if (file) {
      imagePath = `/files/${file.filename}`;
      if (existing.imagePath) {
        const oldFileName = existing.imagePath.replace('/files/', '');
        const oldPath = join(process.cwd(), 'storage', 'uploads', oldFileName);
        if (existsSync(oldPath)) {
          unlinkSync(oldPath);
        }
      }
    }
    const data = await this.prisma.hero.update({
      where: { id },
      data: {
        richText: updateHeroDto.richText ?? existing.richText,
        ctaText: updateHeroDto.ctaText ?? existing.ctaText,
        ctaLink: updateHeroDto.ctaLink ?? existing.ctaLink,
        imagePath: imagePath,
      },
    });
    return data;
  }

  async remove(id: number): Promise<HeroEntity> {
    const existing = await this.prisma.hero.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('Not Found');
    }
    if (existing.imagePath) {
      const oldFileName = existing.imagePath.replace('/files/', '');
      const oldPath = join(process.cwd(), 'storage', 'uploads', oldFileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
    const data = await this.prisma.hero.delete({ where: { id } });
    return data;
  }
}
