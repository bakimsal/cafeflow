import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { PrismaService } from '../../prisma.service';

@Module({
  // Garsonu buraya kaydediyoruz
  controllers: [TablesController],
  // Aşçıyı ve kilerin anahtarını (Prisma) buraya kaydediyoruz
  providers: [TablesService, PrismaService],
})
export class TablesModule {}