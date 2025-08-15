import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ApiLocationsSyncService } from './api-locations-sync.service';

@Module({
  imports: [PrismaModule],
  providers: [ApiLocationsSyncService],
  exports: [ApiLocationsSyncService],
})
export class LocationsModule {}
