import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FaqEntity } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto): Promise<FaqEntity> {
    const data = await this.prisma.faq.create({ data: createFaqDto });
    return data;
  }

  async findAll(): Promise<FaqEntity[]> {
    const data = await this.prisma.faq.findMany();
    return data;
  }

  async findOne(id: number): Promise<FaqEntity> {
    const data = await this.prisma.faq.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Faq not found');
    return data;
  }

  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<FaqEntity> {
    const data = await this.prisma.faq.update({
      where: { id },
      data: updateFaqDto,
    });
    return data;
  }

  async remove(id: number): Promise<FaqEntity> {
    const data = await this.prisma.faq.delete({ where: { id } });
    return data;
  }
}
