import { Module } from '@nestjs/common';
import { Sih3ItemService } from './sih3-item.service';
import { Sih3ItemController } from './sih3-item.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Sih3ItemController],
  providers: [Sih3ItemService],
})
export class Sih3ItemModule {}
