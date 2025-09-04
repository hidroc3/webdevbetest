import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AptechSyncService } from './api-aptech-sync.service';
import { AwlrStationsModule } from '@/modules/awlr-stations/awlr-stations.module';
import { ArrStationsModule } from '@/modules/arr-stations/arr-stations.module';

@Module({
  imports: [HttpModule, AwlrStationsModule, ArrStationsModule],
  providers: [AptechSyncService],
})
export class AptechModule {}
