import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma.service';

@Module({
  // Garsonu buraya kaydediyoruz
  controllers: [ProductsController],
  // Aşçıyı ve kilerin anahtarını (Prisma) buraya kaydediyoruz
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}