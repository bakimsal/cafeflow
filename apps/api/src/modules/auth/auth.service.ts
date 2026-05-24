import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AuthService {
  // Veritabanı bağlantımızı içeri alıyoruz
  constructor(private prisma: PrismaService) {}

  async login(email: string, pass: string) {
    // 1. Kullanıcıyı bul
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. Kullanıcı yoksa veya şifre yanlışsa hata fırlat
    if (!user || user.passwordHash !== pass) {
      throw new UnauthorizedException('E-posta veya şifre hatalı dostum!');
    }

    // 3. Giriş başarılıysa bilgileri döndür
    return {
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}