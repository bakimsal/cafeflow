"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    // Ana modülü kullanarak uygulamayı oluştur
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Baki'nin yazacağı frontend (web) tarafının buraya istek atabilmesi için CORS izni veriyoruz
    app.enableCors();
    // Monorepo kullandığınız için frontend 3000'i alacaktır, biz API'yi 3001 portunda başlatalım
    await app.listen(3001);
    console.log('NestJS Sunucusu 3001 portunda başarıyla ayağa kalktı dostum! 🚀');
}
bootstrap();
