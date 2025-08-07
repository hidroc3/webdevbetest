import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dayjs from 'dayjs';
import { AwlrStationsService } from '@/modules/awlr-stations/awlr-stations.service';
import { ArrStationsService } from '@/modules/arr-stations/arr-stations.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AptechSyncService {
  private readonly logger = new Logger(AptechSyncService.name);

  private apiUrl =
    'https://sdatelemetry.com/API_ap_telemetry/datatelemetry.php?idbbws=2&user=sdatelem_icuadm&pass=Icupu2015';

  constructor(
    private readonly httpService: HttpService,
    private readonly awlrService: AwlrStationsService,
    private readonly arrService: ArrStationsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Running Aptech sync...');
    try {
      await this.sync();
      this.logger.log('Aptech sync complete');
    } catch (err) {
      this.logger.error('Aptech sync failed', err);
    }
  }

  async sync() {
    const { data } = await firstValueFrom(this.httpService.get(this.apiUrl));
    const list = data.telemetryjakarta;

    await this.syncAwlr(list);
    await this.syncArr(list);
  }

  private async syncAwlr(data: any[]) {
    const stations = await this.awlrService.findAll();
    for (const station of stations) {
      const deviceId = station.device_id;
      if (!deviceId) continue;
      const item = data.find((d) => d.nama_lokasi === deviceId);
      if (!item) continue;

      const time = dayjs(`${item.ReceivedDate} ${item.ReceivedTime}`)
        .add(7, 'hour')
        .toDate();
      const waterLevel = Number(item.WLevel) / 100;

      try {
        await this.awlrService.updateByDeviceId(deviceId, {
          time,
          water_level: waterLevel,
          post_name: station.post_name ?? deviceId,
        });
        this.logger.log(
          `AWLR updated: ${station.post_name ?? deviceId} (${deviceId})`,
        );
      } catch (err) {
        this.logger.warn(
          `Failed to update AWLR ${station.post_name ?? deviceId} (${deviceId})`,
          err,
        );
      }
    }
  }

  private async syncArr(data: any[]) {
    const stations = await this.arrService.findAll();
    for (const station of stations) {
      const deviceId = station.device_id;
      if (!deviceId) continue;
      const item = data.find((d) => d.nama_lokasi === deviceId);
      if (!item) continue;

      const time = dayjs(`${item.ReceivedDate} ${item.ReceivedTime}`)
        .add(7, 'hour')
        .toDate();
      const rainfall = Number(item.Rain);

      try {
        await this.arrService.updateByDeviceId(deviceId, {
          time,
          rainfall,
          post_name: station.post_name ?? deviceId,
        });
        this.logger.log(
          `ARR updated: ${station.post_name ?? deviceId} (${deviceId})`,
        );
      } catch (err) {
        this.logger.warn(
          `Failed to update ARR ${station.post_name ?? deviceId} (${deviceId})`,
          err,
        );
      }
    }
  }
}
