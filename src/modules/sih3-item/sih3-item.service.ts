import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSih3ItemDto } from './dto/create-sih3-item.dto';
import { UpdateSih3ItemDto } from './dto/update-sih3-item.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Sih3ItemEntity } from './entities/sih3-item.entity';

@Injectable()
export class Sih3ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSih3ItemDto: CreateSih3ItemDto): Promise<Sih3ItemEntity> {
    const data = await this.prisma.sih3Item.create({ data: createSih3ItemDto });
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
  ): Promise<Sih3ItemEntity> {
    const data = await this.prisma.sih3Item.update({
      where: { id },
      data: updateSih3ItemDto,
    });
    return data;
  }

  async remove(id: number): Promise<Sih3ItemEntity> {
    const data = await this.prisma.sih3Item.delete({ where: { id } });
    return data;
  }
}
