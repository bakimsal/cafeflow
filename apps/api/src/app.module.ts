import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { TablesModule } from './modules/tables/tables.module';
import { AuthModule } from './modules/auth/auth.module'; // Ana Auth paketini içeri alıyoruz

@Module({
  // Parçaları değil, AuthModule'ün kendisini ana sisteme bağlıyoruz
  imports: [CategoriesModule, ProductsModule, TablesModule, AuthModule],
  controllers: [], // Parçaları buradan sildik
  providers: [PrismaService], // Parçaları buradan sildik
})
export class AppModule {}