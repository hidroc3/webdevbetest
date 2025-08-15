import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dayjs from 'dayjs';
import { AwlrStationsService } from '@/modules/awlr-stations/awlr-stations.service';
import { ArrStationsService } from '@/modules/arr-stations/arr-stations.service';
import { Cron, CronExpression } from '@nestjs/schedule';

interface HigertechReading {
  device_id: string;
  reading_at: string;
  water_level?: string;
  rainfall?: string;
  battery?: string;
}

@Injectable()
export class HigertechSyncService {
  private readonly logger = new Logger(HigertechSyncService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly awlrService: AwlrStationsService,
    private readonly arrService: ArrStationsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Running Higertech sync...');
    try {
      await this.syncAwlr();
      await this.syncArr();
      this.logger.log('Higertech sync complete');
    } catch (err) {
      this.logger.error('Higertech sync failed', err);
    }
  }

  // Sync khusus AWLR
  private async syncAwlr() {
    const stations = await this.awlrService.findAll();
    for (const station of stations) {
      if (!station.device_id) continue;
      const data = await this.fetchDeviceData(station.device_id);
      if (!data || !data.device_id || !data.reading_at) {
        this.logger.warn(`No data for AWLR device ${station.device_id}`);
        continue;
      }

      if (data.water_level != null) {
        const payload = {
          time: dayjs(data.reading_at).add(7, 'hour').toDate(),
          water_level: Number(data.water_level),
          battery: data.battery ? Number(data.battery) : undefined,
          post_name: station.post_name ?? data.device_id,
        };
        try {
          await this.awlrService.updateByDeviceId(data.device_id, payload);
          this.logger.log(`AWLR updated: ${data.device_id}`);
        } catch (err) {
          this.logger.warn(`Failed to update AWLR ${data.device_id}`, err);
        }
      }
    }
  }

  // Sync khusus ARR
  private async syncArr() {
    const stations = await this.arrService.findAll();
    for (const station of stations) {
      if (!station.device_id) continue;
      const data = await this.fetchDeviceData(station.device_id);
      if (!data || !data.device_id || !data.reading_at) {
        this.logger.warn(`No data for ARR device ${station.device_id}`);
        continue;
      }

      if (data.rainfall != null) {
        const payload = {
          time: dayjs(data.reading_at).add(7, 'hour').toDate(),
          rainfall: Number(data.rainfall),
          battery: data.battery ? Number(data.battery) : undefined,
          post_name: station.post_name ?? data.device_id,
        };
        try {
          await this.arrService.updateByDeviceId(data.device_id, payload);
          this.logger.log(`ARR updated: ${data.device_id}`);
        } catch (err) {
          this.logger.warn(`Failed to update ARR ${data.device_id}`, err);
        }
      }
    }
  }

  // Ambil data dari API Higertech
  private async fetchDeviceData(
    deviceId: string,
  ): Promise<HigertechReading | null> {
    const url = `https://api.higertech.com/v2/reading/device/${deviceId}`;
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      return Array.isArray(data?.response) ? data.response[0] : null;
    } catch (error) {
      this.logger.error(`Failed to fetch data for device ${deviceId}`, error);
      return null;
    }
  }
}
