import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma.service'; 

@Module({
  // Garsonu buraya kaydediyoruz
  controllers: [CategoriesController],
  // Aşçıyı ve kilerin anahtarını (Prisma) buraya kaydediyoruz
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}