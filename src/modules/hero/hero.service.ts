import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { HeroEntity } from './entities/hero.entity';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHeroDto: CreateHeroDto): Promise<HeroEntity> {
    const data = await this.prisma.hero.create({ data: createHeroDto });
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

  async update(id: number, updateHeroDto: UpdateHeroDto): Promise<HeroEntity> {
    const data = await this.prisma.hero.update({
      where: { id },
      data: updateHeroDto,
    });
    return data;
  }

  async remove(id: number): Promise<HeroEntity> {
    const data = await this.prisma.hero.delete({ where: { id } });
    return data;
  }
}
