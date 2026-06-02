import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly ordersUrl = 'http://localhost:3002/api/orders';

  constructor(private readonly httpService: HttpService) {}

  async redireccionarAMsOrders(datosOrden: any) {
    try {
      // Pasamanos directo: Envía todo el body tal cual llegó a ms-orders
      const { data } = await firstValueFrom(
        this.httpService.post(this.ordersUrl, datosOrden)
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error en el servidor de Órdenes',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}