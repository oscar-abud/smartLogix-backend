// apps/bff/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth') // http://localhost:3000/api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint Público para loguearse
  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  // Endpoint Protegido de prueba (Solo pasa si envías un JWT válido)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: any) {
    return {
      message: 'Tienes acceso al BFF',
      user: req.user, // Aquí vienen los datos del payload que desencriptó la estrategia
    };
  }
}