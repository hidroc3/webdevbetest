import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCctvDto } from './dto/create-cctv.dto';
import { UpdateCctvDto } from './dto/update-cctv.dto';

@Injectable()
export class CctvsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCctvDto) {
    return this.prisma.cctv.create({ data });
  }

  // ================== Pagination Support ==================
  async findMany(skip: number, take: number) {
    return this.prisma.cctv.findMany({
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.cctv.count();
  }

  findAll() {
    return this.prisma.cctv.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.cctv.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCctvDto) {
    return this.prisma.cctv.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.cctv.delete({ where: { id } });
  }
}
