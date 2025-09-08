import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Prisma
import { PrismaModule } from './prisma/prisma.module';

// Modul-modul utama
import { CctvsModule } from './modules/cctvs/cctvs.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { CitiesModule } from './modules/cities/cities.module';
import { SubDistrictsModule } from './modules/sub-districts/sub-districts.module';
import { VillagesModule } from './modules/villages/villages.module';
import { DasModule } from './modules/das/das.module';
import { AwsStationsModule } from './modules/aws-stations/aws-stations.module';
import { AwsLogsModule } from './modules/aws-logs/aws-logs.module';
import { AwlrStationsModule } from './modules/awlr-stations/awlr-stations.module';
import { AwlrLogsModule } from './modules/awlr-logs/awlr-logs.module';
import { ArrStationsModule } from './modules/arr-stations/arr-stations.module';
import { ArrLogsModule } from './modules/arr-logs/arr-logs.module';
import { ContactWaModule } from './modules/contact-wa/contact-wa.module';
import { MessageWaModule } from './modules/message-wa/message-wa.module';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ReportDetailsModule } from './modules/report-details/report-details.module';
import { HydrologyRequestsModule } from './modules/hydrology-requests/hydrology-requests.module';
import { HydraulicOutputHecrasModule } from './modules/hydraulic-output-hecras/hydraulic-output-hecras.module';
import { HydrologicOutputHechmsModule } from './modules/hydrologic-output-hechms/hydrologic-output-hechms.module';

// Wilayah
import { LocationsModule } from './modules/api-locations/api-locations.module';
// get data vendor Aptech
import { AptechModule } from './modules/api-aptech/api-aptech.module';
// get data vendor Higertech
import { HigertechModule } from './modules/api-higertech/api-higertech.module';

import { VehiclesModule } from './modules/vehicles/vehicles.module';
// Scheduller
import { ScheduleModule } from '@nestjs/schedule';
// Sirine
import { SirineModule } from './modules/sirine/sirine.module';
// API Sirine
import { ApiSirineEagleioModule } from './modules/api-sirine-eagleio/api-sirine-eagleio.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AppSettingModule } from './modules/app-setting/app-setting.module';
import { FaqModule } from './modules/faq/faq.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { HeroModule } from './modules/hero/hero.module';
import { Sih3Module } from './modules/sih3/sih3.module';
import { Sih3ItemModule } from './modules/sih3-item/sih3-item.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // scheduller
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage', 'uploads'),
      serveRoot: '/files', // URL prefix akses -> http://localhost:3000/files/namafile.png
    }),
    PrismaModule,
    CctvsModule,
    ProvincesModule,
    CitiesModule,
    SubDistrictsModule,
    VillagesModule,
    DasModule,
    AwsStationsModule,
    AwsLogsModule,
    AwlrStationsModule,
    AwlrLogsModule,
    ArrStationsModule,
    ArrLogsModule,
    ContactWaModule,
    MessageWaModule,
    UsersModule,
    ReportsModule,
    ReportDetailsModule,
    HydrologyRequestsModule,
    HydraulicOutputHecrasModule,
    HydrologicOutputHechmsModule,
    LocationsModule, // jalankan sekali saja
    AptechModule, // get data per-5 menit
    HigertechModule, // get data per-5 menit
    VehiclesModule,
    SirineModule,
    ApiSirineEagleioModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    AppSettingModule,
    FaqModule,
    ContactUsModule,
    HeroModule,
    Sih3Module,
    Sih3ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
