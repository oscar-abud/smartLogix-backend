// bff/src/inventory/inventory.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  private readonly inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';
  private readonly usersMicroserviceUrl = 'http://localhost:3001/api/users'; 

  constructor(private readonly httpService: HttpService) {}

  async getAll() {
    try {
      // 1. Obtener la lista base de almacenes desde el ms-inventory
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

      const userPromises = allUserIds.map(async (id) => {
        try {
          const { data: userData } = await firstValueFrom(
            this.httpService.get(`${this.usersMicroserviceUrl}/${id}`)
          );

          if (userData) {
            const { password, createdAt, ...cleanUser } = userData;
            return cleanUser;
          }
          return null;
        } catch (err: any) {
          console.error(`[BFF] No se pudo obtener el usuario con ID ${id}:`, err.message);
          return null;
        }
      });

      const resolvedUsers = await Promise.all(userPromises);
      const externalUsers = resolvedUsers.filter((user) => user !== null);

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
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.inventoryMicroserviceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al buscar el almacén por ID'
      );
    }
  }

  async createInventory(createInventoryDto: CreateInventoryDto, userId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.inventoryMicroserviceUrl, createInventoryDto, {
          headers: {
            'x-user-id': userId,
          },
        })
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al crear el almacén de inventario'
      );
    }
  }

  async deleteInventory(id: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.inventoryMicroserviceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al eliminar el almacén'
      );
    }
  }
}