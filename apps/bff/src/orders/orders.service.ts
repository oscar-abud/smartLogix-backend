import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';

@Injectable()
export class OrdersService {
  // URL apuntando a tu ms-orders (NestJS en puerto 3003 con prefijo api)
  private readonly ordersMicroserviceUrl = 'http://localhost:3003/api/orders';

  constructor(
    private readonly httpService: HttpService,
    private readonly breakerService: CircuitBreakerService
  ) {}

  async getOrdersHistory() {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-GET-ALL',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(this.ordersMicroserviceUrl)
          );
          return data;
        },
        // Fallback: Si se cae ms-orders, retornamos un arreglo vacío para no congelar la pantalla del Front
        async () => {
          console.error('[BFF Fallback] ms-orders inaccesible. Retornando historial vacío.');
          return [];
        }
      );
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al recuperar el historial de órdenes desde el BFF'
      );
    }
  }

  async getOrderById(orderId: number) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-GET-BY-ID',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.ordersMicroserviceUrl}/${orderId}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException(
            `El servicio de órdenes no está disponible. No se pudo recuperar la orden #${orderId}.`
          );
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || `Error al recuperar la orden #${orderId} desde el BFF`
      );
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // Usamos el Circuit Breaker para proteger las transacciones de escritura
      return await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-CREATE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.post(this.ordersMicroserviceUrl, createOrderDto)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException(
            'El sistema de procesamiento de órdenes no está disponible temporalmente. La compra no pudo ser completada.'
          );
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al procesar la creación de la orden en el BFF'
      );
    }
  }

  async updateOrderStatus(orderId: number, status: string) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-UPDATE-STATUS',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.patch(`${this.ordersMicroserviceUrl}/${orderId}/status`, { status })
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El servicio de actualización de órdenes está caído. Intente más tarde.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(error.response?.data?.message || 'Error al actualizar la orden en el BFF');
    }
  }

  async deleteOrder(orderId: number) {
    try {
      return await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-DELETE',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.delete(`${this.ordersMicroserviceUrl}/${orderId}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('El servicio de eliminación de órdenes no está disponible.');
        }
      );
    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(error.response?.data?.message || 'Error al eliminar la orden desde el BFF');
    }
  }
}