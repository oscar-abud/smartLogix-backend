// apps/bff/src/orders/orders.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  // URLs de los microservicios (en producción vendrán del .env)
  private readonly inventoryUrl = 'http://localhost:3001/api/inventory';
  private readonly ordersUrl = 'http://localhost:3002/api/orders';

  constructor(private readonly httpService: HttpService) {}

  async crearOrdenOrquestada(datosOrden: any) {
    try {
      // 1. Preguntar a MS-Inventory si hay stock del producto
      const { data: tieneStock } = await firstValueFrom(
        this.httpService.get(`${this.inventoryUrl}/check-stock/${datosOrden.productoId}`)
      );

      if (!tieneStock) {
        throw new HttpException('No hay stock disponible para este producto', HttpStatus.BAD_REQUEST);
      }

      // 2. Si hay stock, mandar a crear la orden en MS-Orders
      const { data: nuevaOrden } = await firstValueFrom(
        this.httpService.post(this.ordersUrl, datosOrden)
      );

      // Retornamos al frontend la orden finalizada de forma limpia
      return nuevaOrden;

    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al procesar la orden en el ecosistema',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}