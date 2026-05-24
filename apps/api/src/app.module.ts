import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { PrismaService } from './prisma.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
// Bunu eklediğinden emin ol:
import { TablesModule } from './modules/tables/tables.module';

@Module({
  // Buradaki listeye TablesModule'ü eklediğinden emin ol:
  imports: [CategoriesModule, ProductsModule, TablesModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AppModule {}