// aws-stations.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAwsStationDto } from './dto/create-aws-station.dto';
import { UpdateAwsStationDto } from './dto/update-aws-station.dto';

@Injectable()
export class AwsStationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ================== Status Logic ==================
  private calculateStatus(rainfall?: number): string {
    if (rainfall === undefined || rainfall === null) return 'Tidak Diketahui';
    if (rainfall === 0) return 'Berawan';
    if (rainfall > 0 && rainfall <= 5) return 'Hujan Ringan';
    if (rainfall > 5 && rainfall <= 10) return 'Hujan Sedang';
    if (rainfall > 10 && rainfall <= 20) return 'Hujan Lebat';
    if (rainfall > 20) return 'Hujan Sangat Lebat';
    return 'Tidak Diketahui';
  }

  // ================== Create ==================
  create(data: CreateAwsStationDto) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.awsStation.create({
      data: {
        ...data,
        status,
      },
    });
  }

  // ================== Find All (untuk sinkronisasi) ==================
  findAll() {
    return this.prisma.awsStation.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // ================== Pagination ==================
  async findMany(skip: number, take: number) {
    return this.prisma.awsStation.findMany({
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.awsStation.count();
  }

  // ================== Find One ==================
  findOne(id: number) {
    return this.prisma.awsStation.findUnique({ where: { id } });
  }

  // ================== Update ==================
  update(id: number, data: UpdateAwsStationDto) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.awsStation.update({
      where: { id },
      data: {
        ...data,
        status,
      },
    });
  }

  // ================== Remove ==================
  remove(id: number) {
    return this.prisma.awsStation.delete({ where: { id } });
  }

  // ================== Upsert by Device ID ==================
  async updateByDeviceId(
    device_id: string,
    data: Partial<UpdateAwsStationDto>,
  ) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.awsStation.upsert({
      where: { device_id },
      update: {
        ...data,
        status,
      },
      create: {
        device_id,
        ...data,
        status,
      },
    });
  }
}
