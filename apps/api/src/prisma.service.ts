import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma 7 adaptör ayarımız
    const adapter = new PrismaPg({
      connectionString: "postgresql://postgres:password@localhost:5432/cafeflow?schema=public",
    });
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🔌 NestJS veritabanına başarıyla bağlandı!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}