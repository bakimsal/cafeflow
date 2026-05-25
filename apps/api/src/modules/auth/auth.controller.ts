import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // KORUMALI ALAN: Sadece geçerli bileti olanlar profilini görebilir
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    // Bilet geçerliyse JwtStrategy kullanıcının kim olduğunu buraya koyar
    return req.user;
  }

  // KORUMALI ALAN: Süresi dolmak üzere olan bileti yeniler
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}