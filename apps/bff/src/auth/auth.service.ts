import { Injectable, UnauthorizedException, HttpException, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto'; 
import { CircuitBreakerService } from '../common/circuit-breaker.service';

@Injectable()
export class AuthService {
  private readonly usersServiceUrl = 'http://localhost:3001/api/users';
  private readonly inventoryServiceUrl = 'http://localhost:3002/api/inventory';

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly breakerService: CircuitBreakerService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      // Usamos el breaker para proteger el puerto de red, pero si falla, el fallback lanza un 503 directo
      const usuarioValido = await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-LOGIN',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.post(`${this.usersServiceUrl}/login`, loginDto)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El servicio de autenticación no se encuentra disponible temporalmente.');
        }
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
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.UNAUTHORIZED;
      const message = error.response?.data?.message || 'Credenciales incorrectas o usuario no encontrado';
      throw new HttpException(message, status);
    }
  }

  async register(registerDto: RegisterDto) {
    const { inventoryId, ...userData } = registerDto;

    try {
      // Protegemos el registro maestro en ms-users
      const createdUser = await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-REGISTER',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.post(`${this.usersServiceUrl}/register`, userData)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El sistema de registro no está disponible temporalmente.');
        }
      );
      
      // Vinculación con ms-inventory usando su propio aislamiento interno
      if (inventoryId && createdUser?.id) {
        try {
          await firstValueFrom(
            this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
              headers: { 'x-user-id': createdUser.id },
            })
          );
        } catch (invError: any) {
          console.error(`[BFF Orquestador] Usuario creado (${createdUser.id}) pero falló vinculación física en almacén ${inventoryId}:`, invError.message);
        }
      }

      return {
        ...createdUser,
        inventoryId: inventoryId ? Number(inventoryId) : null
      };

    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al registrar el usuario en el sistema';
      throw new HttpException(message, status);
    }
  }

  async getAll() {
    try {
      // Al ser una lectura (GET), el fallback mitiga devolviendo un array vacío para que el front no se rompa
      return await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-GET-ALL',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.usersServiceUrl}`)
          );
          return data;
        },
        async () => {
          console.error('[BFF Fallback] ms-users inaccesible al listar todos. Enviando array vacío.');
          return [];
        }
      );
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || 'Error al buscar usuarios';
      throw new HttpException(message, status);
    }
  }
  
  async getUser(id: string) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-GET-ONE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.usersServiceUrl}/${id}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('No se puede recuperar la información del perfil en este momento.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.NOT_FOUND;
      const message = error.response?.data?.message || 'Error al buscar un usuario';
      throw new HttpException(message, status);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { inventoryId, ...userData } = updateUserDto;

    try {
      const updatedUser = await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-UPDATE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.patch(`${this.usersServiceUrl}/${id}`, userData)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El sistema de actualización de perfiles está fuera de línea.');
        }
      );

      if (inventoryId) {
        try {
          await firstValueFrom(
            this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
              headers: { 'x-user-id': id },
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
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al actualizar el usuario';
      throw new HttpException(message, status);
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-DELETE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.delete(`${this.usersServiceUrl}/${id}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('No se pudo procesar la eliminación del usuario debido a una falla del servidor.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al eliminar un usuario';
      throw new HttpException(message, status);
    }
  }

  async unlinkUserFromInventory(inventoryId: number, userId: string) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-UNLINK',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.delete(`${this.inventoryServiceUrl}/${inventoryId}/users/${userId}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El sistema de inventarios no responde. No se pudo desvincular al operador.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      const status = error.response?.status || HttpStatus.BAD_REQUEST;
      const message = error.response?.data?.message || 'Error al desvincular al usuario del almacén';
      throw new HttpException(message, status);
    }
  }
}