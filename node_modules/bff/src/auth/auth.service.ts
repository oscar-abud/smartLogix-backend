// bff/src/auth/auth.service.ts
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
  private readonly inventoryServiceUrl = 'http://localhost:3002/api/inventory';

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
    const { inventoryId, ...userData } = registerDto;

    try {
      // 1. Registramos el usuario de manera normal en ms-users
      const { data: createdUser } = await firstValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/register`, userData)
      );
      
      // 2. Si hay un almacén seleccionado, intentamos vincularlo
      if (inventoryId && createdUser?.id) {
        try {
          await firstValueFrom(
            this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
              headers: {
                'x-user-id': createdUser.id,
              },
            })
          );
        } catch (invError: any) {
          // Si falla ms-inventory, lo reportamos en consola pero NO tumbamos la respuesta al cliente
          console.error(`[BFF Orquestador] Usuario creado (${createdUser.id}) pero falló vinculación física en almacén ${inventoryId}:`, invError.message);
        }
      }

      return {
        ...createdUser,
        inventoryId: inventoryId ? Number(inventoryId) : null
      };

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
    const { inventoryId, ...userData } = updateUserDto;

    try {
      // 1. Actualizamos el perfil en ms-users
      const { data: updatedUser } = await firstValueFrom(
        this.httpService.patch(`${this.usersServiceUrl}/${id}`, userData)
      );

      // 2. Si se editó agregando o cambiando un almacén, enviamos la relación
      if (inventoryId) {
        try {
          await firstValueFrom(
            this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
              headers: {
                'x-user-id': id,
              },
            })
          );
        } catch (invError: any) {
          console.error(`[BFF Orquestador] Error editando asignación de almacén para usuario ${id}:`, invError.message);
        }
      }

      return {
        ...updatedUser,
        inventoryId: inventoryId ? Number(inventoryId) : null
      };

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

  async unlinkUserFromInventory(inventoryId: number, userId: string) {
    try {
      // Le pegamos al microservicio metiendo el userId en la URL
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.inventoryServiceUrl}/${inventoryId}/users/${userId}`)
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al desvincular al usuario del almacén';
      throw new HttpException(message, status);
    }
  }

}