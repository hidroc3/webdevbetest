import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateArrLogDto } from './dto/create-arr-log.dto';
import { UpdateArrLogDto } from './dto/update-arr-log.dto';

@Injectable()
export class ArrLogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateArrLogDto) {
    return this.prisma.arrLog.create({ data });
  }

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

      if (end.getTime() - start.getTime() > 31 * 24 * 60 * 60 * 1000) {
        throw new BadRequestException('Date range cannot exceed 1 month');
      }

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      where.time = { gte: start, lte: end };
    }

    if (search) {
      where.post_name = { contains: search };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.arrLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { time: 'desc' },
      }),
      this.prisma.arrLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  updateById(id: number, data: UpdateArrLogDto) {
    return this.prisma.arrLog.update({ where: { id }, data });
  }

  deleteById(id: number) {
    return this.prisma.arrLog.delete({ where: { id } });
  }

  deleteAll() {
    return this.prisma.arrLog.deleteMany({});
  }

  // SUM curah hujan per jam
  async sumRainfallPerHour(
    page = 1,
    limit = 10,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const allLogs = await this.prisma.arrLog.findMany({
      where: {
        time: { gte: start, lte: end },
        ...(search ? { post_name: { contains: search } } : {}),
      },
      orderBy: { time: 'asc' },
    });

    const grouped: Record<string, number> = {};
    allLogs.forEach((log) => {
      if (!log.time) return;
      const hourKey = log.time.toISOString().slice(0, 13); // yyyy-mm-ddTHH
      grouped[hourKey] = (grouped[hourKey] || 0) + (log.rainfall ?? 0);
    });

    const keys = Object.keys(grouped).sort();
    const pagedKeys = keys.slice((page - 1) * limit, page * limit);

    const data = pagedKeys.map((key) => ({
      time: key,
      totalRainfall: grouped[key],
      status: this.calculateStatus(grouped[key]),
    }));

    return {
      data,
      total: keys.length,
      page,
      limit,
      totalPages: Math.ceil(keys.length / limit),
    };
  }

  // SUM curah hujan per hari
  async sumRainfallPerDay(
    page = 1,
    limit = 10,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const allLogs = await this.prisma.arrLog.findMany({
      where: {
        time: { gte: start, lte: end },
        ...(search ? { post_name: { contains: search } } : {}),
      },
      orderBy: { time: 'asc' },
    });

    const groupedDay: Record<string, number> = {};
    allLogs.forEach((log) => {
      if (!log.time) return;
      const dayKey = log.time.toISOString().slice(0, 10); // yyyy-mm-dd
      groupedDay[dayKey] = (groupedDay[dayKey] || 0) + (log.rainfall ?? 0);
    });

    const keys = Object.keys(groupedDay).sort();
    const pagedKeys = keys.slice((page - 1) * limit, page * limit);

    const data = pagedKeys.map((key) => ({
      date: key,
      totalRainfall: groupedDay[key],
      status: this.calculateStatus(groupedDay[key]),
    }));

    return {
      data,
      total: keys.length,
      page,
      limit,
      totalPages: Math.ceil(keys.length / limit),
    };
  }

  // Kriteria status curah hujan
  private calculateStatus(rainfall?: number): string {
    if (rainfall === undefined || rainfall === null) return 'Tidak Diketahui';
    if (rainfall === 0) return 'Berawan';
    if (rainfall > 0 && rainfall <= 5) return 'Hujan Ringan';
    if (rainfall > 5 && rainfall <= 10) return 'Hujan Sedang';
    if (rainfall > 10 && rainfall <= 20) return 'Hujan Lebat';
    if (rainfall > 20) return 'Hujan Sangat Lebat';
    return 'Tidak Diketahui';
  }
}
