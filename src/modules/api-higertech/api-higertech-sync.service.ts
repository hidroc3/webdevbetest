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
      await this.sync();
      this.logger.log('Higertech sync complete');
    } catch (err) {
      this.logger.error('Higertech sync failed', err);
    }
  }

  async sync() {
    const stations = await this.awlrService.findAll();
    for (const station of stations) {
      const deviceId = station.device_id;
      if (!deviceId) continue;
      const data = await this.fetchDeviceData(deviceId);
      if (!data || !data.device_id || !data.reading_at) {
        this.logger.warn(`No data for device ${deviceId}`);
        continue;
      }

      // Jika ada water_level, update AWLR
      if (data.water_level != null) {
        const payload = {
          time: dayjs(data.reading_at).add(7, 'hour').toDate(),
          water_level: Number(data.water_level),
          battery: data.battery ? Number(data.battery) : undefined,
          post_name: station.post_name ?? deviceId,
        };
        try {
          await this.awlrService.updateByDeviceId(deviceId, payload);
          this.logger.log(`AWLR updated: ${deviceId}`);
        } catch (err) {
          this.logger.warn(`Failed to update AWLR ${deviceId}`, err);
        }
      }

      // Jika ada rainfall, update ARR
      if (data.rainfall != null) {
        const payload = {
          time: dayjs(data.reading_at).add(7, 'hour').toDate(),
          rainfall: Number(data.rainfall),
          battery: data.battery ? Number(data.battery) : undefined,
          post_name: station.post_name ?? deviceId,
        };
        try {
          await this.arrService.updateByDeviceId(deviceId, payload);
          this.logger.log(`ARR updated: ${deviceId}`);
        } catch (err) {
          this.logger.warn(`Failed to update ARR ${deviceId}`, err);
        }
      }
    }
  }

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
