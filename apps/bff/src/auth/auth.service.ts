import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios'; // 1. Importamos HttpService
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly usersServiceUrl = 'http://localhost:3001/api/users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async login(loginDto: any) {
    try {
      const { data: usuarioValido } = await firstValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/validate`, loginDto)
      );

      // Si el microservicio responde con éxito, estructuramos el Payload del JWT
      const payload = { 
        email: usuarioValido.email, 
        sub: usuarioValido.id, 
        role: usuarioValido.role 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: { 
          email: usuarioValido.email, 
          role: usuarioValido.role 
        }
      };

    } catch (error) {
      throw new UnauthorizedException('Credenciales incorrectas o usuario no encontrado');
    }
  }

  async register(registerDto: any) {
    try {
      // Usamos firstValueFrom igual que en el login para pegarle al ms-users
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/register`, registerDto)
      );
      
      // Le devolvemos al frontend el usuario que el microservicio acaba de crear
      return data;
    } catch (error: any) {
      // Si el microservicio falla (ej: correo duplicado), atrapamos el error y lo lanzamos limpio
      throw new UnauthorizedException(
        error.response?.data?.message || 'Error al registrar el usuario en el sistema'
      );
    }
  }

  async getAll() {
    try {
      // Usamos firstValueFrom igual que en el login para pegarle al ms-users
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}`)
      );
      
      return data;
    } catch (error: any) {
      // Si el microservicio falla (ej: correo duplicado), atrapamos el error y lo lanzamos limpio
      throw new UnauthorizedException(
        error.response?.data?.message || 'Error al registrar el usuario en el sistema'
      );
    }
  }
}