import { Controller, Post, Body, Get, UseGuards, Req, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // 1. Importamos el DTO
import { AuthGuard } from '@nestjs/passport';

@Controller('auth') // http://localhost:3000/api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getAll() {
    return this.authService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:id')
  async findUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}