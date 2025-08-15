import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ApiLocationsSyncService implements OnModuleInit {
  private readonly logger = new Logger(ApiLocationsSyncService.name);
  private readonly BASE_URL =
    'https://emsifa.github.io/api-wilayah-indonesia/api';

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const alreadySynced = await this.isLocationsSynced();
    if (!alreadySynced) {
      this.logger.log('🚀 Sinkronisasi data wilayah dimulai...');
      await this.syncLocations();
      this.logger.log('✅ Sinkronisasi selesai.');
    } else {
      this.logger.log('✅ Data wilayah sudah ada di database.');
    }
  }

  async isLocationsSynced(): Promise<boolean> {
    const count = await this.prisma.province.count();
    return count > 0;
  }

  async syncLocations() {
    const provinsiIds = ['32', '36']; // Jawa Barat & Banten

    const { data: allProvinces } = await axios.get(
      `${this.BASE_URL}/provinces.json`,
    );
    const filteredProvinces = allProvinces.filter((p) =>
      provinsiIds.includes(p.id),
    );

    for (const province of filteredProvinces) {
      await this.prisma.province.upsert({
        where: { id: BigInt(province.id) },
        update: { name: province.name },
        create: { id: BigInt(province.id), name: province.name },
      });

      const { data: regencies } = await axios.get(
        `${this.BASE_URL}/regencies/${province.id}.json`,
      );
      for (const city of regencies) {
        await this.prisma.city.upsert({
          where: { id: BigInt(city.id) },
          update: { name: city.name, provinceId: BigInt(province.id) },
          create: {
            id: BigInt(city.id),
            name: city.name,
            provinceId: BigInt(province.id),
          },
        });

        const { data: districts } = await axios.get(
          `${this.BASE_URL}/districts/${city.id}.json`,
        );
        for (const district of districts) {
          await this.prisma.subDistrict.upsert({
            where: { id: BigInt(district.id) },
            update: { name: district.name, cityId: BigInt(city.id) },
            create: {
              id: BigInt(district.id),
              name: district.name,
              cityId: BigInt(city.id),
            },
          });

          const { data: villages } = await axios.get(
            `${this.BASE_URL}/villages/${district.id}.json`,
          );
          for (const village of villages) {
            await this.prisma.village.upsert({
              where: { id: BigInt(village.id) },
              update: {
                name: village.name,
                subDistrictId: BigInt(district.id),
              },
              create: {
                id: BigInt(village.id),
                name: village.name,
                subDistrictId: BigInt(district.id),
              },
            });
          }
        }
      }

      this.logger.log(
        `✅ Selesai sync lokasi untuk provinsi: ${province.name}`,
      );
    }
  }
}
