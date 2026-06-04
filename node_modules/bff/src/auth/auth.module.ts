import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { UsersProxyController } from './users-proxy.controller';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'TU_FIRMA_SECRETA_SUPER_SEGURA',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, UsersProxyController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}