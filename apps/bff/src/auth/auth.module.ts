import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    HttpModule, // Lo necesitaremos para verificar usuarios con otros microservicios
    JwtModule.register({
      secret: 'TU_FIRMA_SECRETA_SUPER_SEGURA', // En producción usa process.env.JWT_SECRET
      signOptions: { expiresIn: '1d' }, // El token expira en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}