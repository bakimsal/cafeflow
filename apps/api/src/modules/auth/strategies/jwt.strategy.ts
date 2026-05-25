import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bileti Header'dan al
      ignoreExpiration: false, // Süresi dolan bileti reddet
      secretOrKey: 'cafeflow-super-gizli-anahtar-2026', // Bilet makinesindeki aynı şifre
    });
  }

  async validate(payload: any) {
    // Bilet geçerliyse, içindeki bilgileri sisteme (request.user) aktar
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}