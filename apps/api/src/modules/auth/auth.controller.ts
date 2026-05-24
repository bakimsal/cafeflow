import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// İsteklerin geleceği ana adres: /api/auth
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  @Post('login')
  async login(@Body() body: any) {
    // Frontend'den gelen email ve şifreyi alıp az önce yazdığımız servise gönderiyoruz
    return this.authService.login(body.email, body.password);
  }
}