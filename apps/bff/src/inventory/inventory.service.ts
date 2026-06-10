import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {
  private readonly inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';
  private readonly usersMicroserviceUrl = 'http://localhost:3001/api/users'; 

  constructor(
    private readonly httpService: HttpService, 
    private readonly breakerService: CircuitBreakerService
  ) {}

  async getAll() {
    try {
      // Obtener la lista base de almacenes desde el ms-inventory
      const { data: localInventories } = await firstValueFrom(
        this.httpService.get(this.inventoryMicroserviceUrl)
      );

      if (!Array.isArray(localInventories) || localInventories.length === 0) {
        return [];
      }

      const allUserIds: string[] = Array.from(
        new Set(localInventories.flatMap((inv: any) => inv.userIds || []))
      );

      if (allUserIds.length === 0) {
        return localInventories.map((inv: any) => ({ ...inv, users: [] }));
      }

      // Protegemos la hidratación masiva de usuarios con el Circuit Breaker
      const externalUsers = await this.breakerService.runWithCircuitBreaker(
        'MS-USERS-GET-ALL',
        async () => {
          const userPromises = allUserIds.map(async (id) => {
            const { data: userData } = await firstValueFrom(
              this.httpService.get(`${this.usersMicroserviceUrl}/${id}`)
            );
            if (userData) {
              const { password, createdAt, ...cleanUser } = userData;
              return cleanUser;
            }
            return null;
          });
          const resolved = await Promise.all(userPromises);
          return resolved.filter((user) => user !== null);
        },
        // Fallback: Si ms-users se cae, el listado general sigue cargando sin colapsar el BFF
        async () => {
          console.error('[BFF Fallback - getAll] ms-users inaccesible. Retornando lista sin nombres de operador.');
          return []; 
        }
      );

      return localInventories.map((inventory: any) => {
        return {
          ...inventory,
          users: externalUsers.filter((u: any) => inventory.userIds.includes(u.id)),
        };
      });

    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error en el orquestador BFF al consolidar inventarios con usuarios'
      );
    }
  }

  async getInventory(id: number) {
    try {
      const { data: inventory } = await firstValueFrom(
        this.httpService.get(`${this.inventoryMicroserviceUrl}/${id}`)
      );

      if (!inventory || !inventory.userIds || inventory.userIds.length === 0) {
        return { ...inventory, users: [] };
      }

      const externalUsers = await this.breakerService.runWithCircuitBreaker(
        'MS-USERS',
        async () => {
          const userPromises = inventory.userIds.map(async (userId: string) => {
            const { data: userData } = await firstValueFrom(
              this.httpService.get(`${this.usersMicroserviceUrl}/${userId}`)
            );
            const { password, createdAt, ...cleanUser } = userData;
            return cleanUser;
          });
          const resolved = await Promise.all(userPromises);
          return resolved.filter(u => u !== null);
        },
        async () => {
          console.error(`[BFF Fallback] Retornando usuarios fantasma temporales debido a caída de ms-users`);
          return inventory.userIds.map((userId: string) => ({
            id: userId,
            email: 'usuario.no.disponible@smartlogix.com',
            role: { id: 0, name: 'OFFLINE_MODE' }
          }));
        }
      );
      
      return {
        ...inventory,
        users: externalUsers,
      };

    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || `Error en el orquestador BFF al consolidar el detalle del almacén #${id}`
      );
    }
  }

  async getAllTypes() {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-GET-TYPES',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.inventoryMicroserviceUrl}/types`)
          );
          return data;
        },
        // Fallback: Si ms-inventory falla, devolvemos opciones genéricas temporalmente para no bloquear la UI
        async () => {
          console.error('[BFF Fallback - getTypes] ms-inventory inaccesible. Devolviendo catálogo de emergencia.');
          return [
            { id: 1, name: 'Inventario A (Supermercado) [MODO OFFLINE]', description: 'Catálogo de contingencia' },
            { id: 2, name: 'Inventario B (Médico) [MODO OFFLINE]', description: 'Catálogo de contingencia' }
          ];
        }
      );
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al recuperar el catálogo de tipos de inventario'
      );
    }
  }

  async createInventory(createInventoryDto: CreateInventoryDto, userId: string) {
    try {
      // En operaciones de escritura, el fallback NO inventa datos; arroja una excepción limpia de disponibilidad
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-CREATE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.post(this.inventoryMicroserviceUrl, createInventoryDto, {
              headers: { 'x-user-id': userId },
            })
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El sistema de creación de almacenes no está disponible temporalmente. Intente más tarde.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al crear el almacén de inventario'
      );
    }
  }

  async addItemToInventory(inventoryId: number, createItemDto: CreateItemDto) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-ADD-ITEM',
        async () => {
          // Enrutamos la petición de forma dinámica inyectando el ID del almacén en la URL objetivo del MS
          const { data } = await firstValueFrom(
            this.httpService.post(`${this.inventoryMicroserviceUrl}/${inventoryId}/items`, createItemDto)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException(
            'El servicio encargado de añadir productos al inventario no se encuentra disponible.'
          );
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al procesar el alta del producto desde el orquestador BFF'
      );
    }
  }

  async createType(createInventoryTypeDto: CreateInventoryTypeDto) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-CREATE-TYPE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.post(`${this.inventoryMicroserviceUrl}/types`, createInventoryTypeDto)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El servicio de configuración de tipos de almacén no está disponible.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al procesar el alta de la categoría desde el BFF'
      );
    }
  }

  async updateItemStock(itemId: number, updateStockDto: UpdateStockDto) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-UPDATE-STOCK',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.patch(`${this.inventoryMicroserviceUrl}/items/${itemId}/stock`, updateStockDto)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException(
            'El servicio de actualización de inventarios no está disponible en este momento. La orden no pudo alterar el stock.'
          );
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al procesar la actualización de stock en el BFF'
      );
    }
  }

  async deleteInventory(id: number) {
    try {
      // Aplicamos la misma lógica de protección de infraestructura para escrituras
      return await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-DELETE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.delete(`${this.inventoryMicroserviceUrl}/${id}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El sistema de eliminación de almacenes no está respondiendo. Intente más tarde.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al eliminar el almacén'
      );
    }
  }
}