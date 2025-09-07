import { Module } from '@nestjs/common';
import { AppSettingService } from './app-setting.service';
import { AppSettingController } from './app-setting.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UploadModule } from '@/upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  providers: [AppSettingService],
  controllers: [AppSettingController],
})
export class AppSettingModule {}
