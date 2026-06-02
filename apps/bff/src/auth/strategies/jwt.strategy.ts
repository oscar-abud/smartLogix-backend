// apps/bff/src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'TU_FIRMA_SECRETA_SUPER_SEGURA',
    });
  }

  // Lo que retorne esta función se inyectará automáticamente en el objeto 'req.user'
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}