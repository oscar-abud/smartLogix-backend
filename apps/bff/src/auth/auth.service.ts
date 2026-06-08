import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto'; 

@Injectable()
export class AuthService {
  private readonly usersServiceUrl = 'http://localhost:3001/api/users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { data: usuarioValido } = await firstValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/login`, loginDto)
      );

      const payload = { 
        email: usuarioValido.email, 
        sub: usuarioValido.id, 
        id_role: usuarioValido.role.id,
        role: usuarioValido.role.name
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: usuarioValido.id,
          email: usuarioValido.email,
          role: {
            id: usuarioValido.role.id,
            name: usuarioValido.role.name,
          },
          createdAt: usuarioValido.createdAt,
        }
      };

    } catch (error: any) {
      const status = error.response?.status || HttpStatus.UNAUTHORIZED;
      const message = error.response?.data?.message || 'Credenciales incorrectas o usuario no encontrado';
      throw new HttpException(message, status);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/register`, registerDto)
      );
      
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al registrar el usuario en el sistema';
      throw new HttpException(message, status);
    }
  }

  async getAll() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}`)
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || 'Error al buscar usuarios';
      throw new HttpException(message, status);
    }
  }
  
  async getUser(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.NOT_FOUND;
      const message = error.response?.data?.message || 'Error al buscar un usuario';
      throw new HttpException(message, status);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`${this.usersServiceUrl}/${id}`, updateUserDto)
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al actualizar el usuario';
      throw new HttpException(message, status);
    }
  }

  async deleteUser(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.usersServiceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al eliminar un usuario';
      throw new HttpException(message, status);
    }
  }
}