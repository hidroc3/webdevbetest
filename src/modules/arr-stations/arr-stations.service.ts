import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateArrStationDto } from './dto/create-arr-station.dto';
import { UpdateArrStationDto } from './dto/update-arr-station.dto';

@Injectable()
export class ArrStationsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateStatus(rainfall?: number): string {
    if (rainfall === undefined || rainfall === null) return 'Tidak Diketahui';
    if (rainfall === 0) return 'Berawan';
    if (rainfall > 0 && rainfall <= 5) return 'Hujan Ringan';
    if (rainfall > 5 && rainfall <= 10) return 'Hujan Sedang';
    if (rainfall > 10 && rainfall <= 20) return 'Hujan Lebat';
    if (rainfall > 20) return 'Hujan Sangat Lebat';
    return 'Tidak Diketahui';
  }

  create(data: CreateArrStationDto) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.arrStation.create({
      data: {
        ...data,
        status,
      },
    });
  }

  findAll() {
    return this.prisma.arrStation.findMany();
  }

  findOne(id: number) {
    return this.prisma.arrStation.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateArrStationDto) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.arrStation.update({
      where: { id },
      data: {
        ...data,
        status,
      },
    });
  }

  remove(id: number) {
    return this.prisma.arrStation.delete({ where: { id } });
  }

  async updateByDeviceId(
    device_id: string,
    data: Partial<UpdateArrStationDto>,
  ) {
    const status = this.calculateStatus(data.rainfall);
    return this.prisma.arrStation.upsert({
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
