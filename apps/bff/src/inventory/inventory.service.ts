// apps/bff/src/inventory/inventory.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryService {
  // 🌐 Apuntamos directo al puerto del microservicio de inventario
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

  async getProduct(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.inventoryMicroserviceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al buscar el producto por ID'
      );
    }
  }

  async createProduct(createInventoryDto: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.inventoryMicroserviceUrl, createInventoryDto)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al crear el producto'
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.inventoryMicroserviceUrl}/${id}`)
      );
      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al eliminar el producto'
      );
    }
  }
}