// apps/bff/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Simulación temporal (Luego harás un fetch al MS correspondiente)
    if (email === 'admin@smartlogix.com' && password === '123456') {
      const payload = { email: email, sub: 'user_id_123', role: 'admin' };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: { email, role: 'admin' }
      };
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }
}