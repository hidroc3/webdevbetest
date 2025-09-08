import { Module } from '@nestjs/common';
import { Sih3Service } from './sih3.service';
import { Sih3Controller } from './sih3.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Sih3Controller],
  providers: [Sih3Service],
})
export class Sih3Module {}
