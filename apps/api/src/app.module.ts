import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { TablesModule } from './modules/tables/tables.module';
import { AuthModule } from './modules/auth/auth.module'; 
import { OrdersModule } from './modules/orders/orders.module'; // <-- 1. Orders modülünü yukarıda içeri alıyoruz

@Module({
  // 2. imports dizisinin en sonuna OrdersModule'ü ekliyoruz
  imports: [CategoriesModule, ProductsModule, TablesModule, AuthModule, OrdersModule],
  controllers: [], 
  providers: [PrismaService], 
})
export class AppModule {}