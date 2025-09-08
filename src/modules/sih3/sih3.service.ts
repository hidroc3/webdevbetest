import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSih3Dto } from './dto/create-sih3.dto';
import { UpdateSih3Dto } from './dto/update-sih3.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Sih3Entity } from './entities/sih3.entity';

@Injectable()
export class Sih3Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSih3Dto: CreateSih3Dto): Promise<Sih3Entity> {
    const data = await this.prisma.sih3.create({ data: createSih3Dto });
    return data;
  }

  async findAll(): Promise<Sih3Entity[]> {
    const data = await this.prisma.sih3.findMany();
    return data;
  }

  async findOne(id: number): Promise<Sih3Entity> {
    const data = await this.prisma.sih3.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Not found');
    return data;
  }

  async update(id: number, updateSih3Dto: UpdateSih3Dto): Promise<Sih3Entity> {
    const data = await this.prisma.sih3.update({
      where: { id },
      data: updateSih3Dto,
    });
    return data;
  }

  async remove(id: number): Promise<Sih3Entity> {
    const data = await this.prisma.sih3.delete({ where: { id } });
    return data;
  }
}
