import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Ana modülü kullanarak uygulamayı oluştur
  const app = await NestFactory.create(AppModule);
  
  // Baki'nin yazacağı frontend (web) tarafının buraya istek atabilmesi için CORS izni veriyoruz
  app.enableCors();

  // Monorepo kullandığınız için frontend 3000'i alacaktır, biz API'yi 3001 portunda başlatalım
  await app.listen(3001);
  console.log('NestJS Sunucusu 3001 portunda başarıyla ayağa kalktı dostum! 🚀');
}
bootstrap();