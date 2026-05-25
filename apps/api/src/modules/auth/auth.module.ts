import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy'; // 1. Bunu ekle

@Module({
  imports: [
    JwtModule.register({
      secret: 'cafeflow-super-gizli-anahtar-2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // 2. Listeye ekle
})
export class AuthModule {}