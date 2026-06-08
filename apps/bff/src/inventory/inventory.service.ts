import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  private readonly inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';

  constructor(private readonly httpService: HttpService) {}

  async getAll() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.inventoryMicroserviceUrl)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al conectar con el microservicio de inventario'
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