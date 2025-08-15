import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAwlrLogDto } from './dto/create-awlr-log.dto';
import { UpdateAwlrLogDto } from './dto/update-awlr-log.dto';

@Injectable()
export class AwlrLogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAwlrLogDto) {
    return this.prisma.awlrLog.create({ data });
  }

  // Get logs with search, by post_name, date range
  async findFiltered(
    page = 1,
    limit = 10,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const diff = end.getTime() - start.getTime();
      if (diff > 31 * 24 * 60 * 60 * 1000) {
        throw new BadRequestException('Date range cannot exceed 1 month');
      }

      where.time = { gte: start, lte: end };
    }

    if (search) {
      where.post_name = { contains: search };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.awlrLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { time: 'desc' },
      }),
      this.prisma.awlrLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  updateById(id: number, data: UpdateAwlrLogDto) {
    return this.prisma.awlrLog.update({ where: { id }, data });
  }

  deleteById(id: number) {
    return this.prisma.awlrLog.delete({ where: { id } });
  }

  deleteAll() {
    return this.prisma.awlrLog.deleteMany({});
  }
}
