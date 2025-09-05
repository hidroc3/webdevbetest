import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAwlrStationDto } from './dto/create-awlr-station.dto';
import { UpdateAwlrStationDto } from './dto/update-awlr-station.dto';

@Injectable()
export class AwlrStationsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateDebitCustom(
    water_level?: number,
    flow_a?: number,
    flow_b?: number,
    flow_ho?: number,
  ): number | undefined {
    if (
      typeof water_level === 'number' &&
      typeof flow_a === 'number' &&
      typeof flow_b === 'number' &&
      typeof flow_ho === 'number'
    ) {
      let H = 0;
      if (flow_ho === 0) {
        H = water_level - flow_ho;
      } else {
        H = water_level + flow_ho;
      }

      if (H <= 0) return 0;

      const debit = flow_a * Math.pow(H, flow_b);
      return parseFloat(debit.toFixed(4));
    }
    return undefined;
  }

  private calculateStatus(
    water_level: number,
    alert_level_1: number,
    alert_level_2: number,
    alert_level_3: number,
  ): string {
    if (water_level >= alert_level_1) {
      return 'Awas';
    } else if (water_level >= alert_level_2) {
      return 'Waspada';
    } else if (water_level >= alert_level_3) {
      return 'Siaga';
    } else {
      return 'Normal';
    }
  }

  async create(data: CreateAwlrStationDto) {
    const debit = this.calculateDebitCustom(
      data.water_level,
      data.flow_a,
      data.flow_b,
      data.flow_ho,
    );

    const status = this.calculateStatus(
      data.water_level ?? 0,
      data.alert_level_1 ?? 0,
      data.alert_level_2 ?? 0,
      data.alert_level_3 ?? 0,
    );

    return this.prisma.awlrStation.create({
      data: {
        ...data,
        debit,
        status,
      },
    });
  }

  // ================== Pagination  ==================
  async count(): Promise<number> {
    return this.prisma.awlrStation.count();
  }

  async findMany(skip: number, take: number) {
    return this.prisma.awlrStation.findMany({
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }
  // ================== Pagination  ==================

  findAll() {
    return this.prisma.awlrStation.findMany();
  }

  findOne(id: number) {
    return this.prisma.awlrStation.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateAwlrStationDto) {
    const existing = await this.findOne(id);
    if (!existing)
      throw new NotFoundException(`AWLR Station with id ${id} not found`);

    const water_level = data.water_level ?? existing.water_level ?? 0;
    const flow_a = data.flow_a ?? existing.flow_a ?? 0;
    const flow_b = data.flow_b ?? existing.flow_b ?? 0;
    const flow_ho = data.flow_ho ?? existing.flow_ho ?? 0;

    const alert_level_1 = data.alert_level_1 ?? existing.alert_level_1 ?? 0;
    const alert_level_2 = data.alert_level_2 ?? existing.alert_level_2 ?? 0;
    const alert_level_3 = data.alert_level_3 ?? existing.alert_level_3 ?? 0;

    const debit = this.calculateDebitCustom(
      water_level,
      flow_a,
      flow_b,
      flow_ho,
    );

    const status = this.calculateStatus(
      water_level,
      alert_level_1,
      alert_level_2,
      alert_level_3,
    );

    return this.prisma.awlrStation.update({
      where: { id },
      data: {
        ...data,
        debit,
        alert_level_1,
        alert_level_2,
        alert_level_3,
        status,
      },
    });
  }

  async updateByDeviceId(
    device_id: string,
    data: Partial<UpdateAwlrStationDto>,
  ) {
    const existing = await this.prisma.awlrStation.findUnique({
      where: { device_id },
    });

    const water_level = data.water_level ?? existing?.water_level ?? 0;
    const flow_a = data.flow_a ?? existing?.flow_a ?? 0;
    const flow_b = data.flow_b ?? existing?.flow_b ?? 0;
    const flow_ho = data.flow_ho ?? existing?.flow_ho ?? 0;

    const alert_level_1 = data.alert_level_1 ?? existing?.alert_level_1 ?? 0;
    const alert_level_2 = data.alert_level_2 ?? existing?.alert_level_2 ?? 0;
    const alert_level_3 = data.alert_level_3 ?? existing?.alert_level_3 ?? 0;

    const debit = this.calculateDebitCustom(
      water_level,
      flow_a,
      flow_b,
      flow_ho,
    );

    const status = this.calculateStatus(
      water_level,
      alert_level_1,
      alert_level_2,
      alert_level_3,
    );

    return this.prisma.awlrStation.upsert({
      where: { device_id },
      update: {
        ...data,
        debit,
        alert_level_1,
        alert_level_2,
        alert_level_3,
        status,
      },
      create: {
        device_id,
        ...data,
        debit,
        alert_level_1,
        alert_level_2,
        alert_level_3,
        status,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.awlrStation.delete({ where: { id } });
  }
}
