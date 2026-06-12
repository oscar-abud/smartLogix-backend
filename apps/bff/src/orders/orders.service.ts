import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';

@Injectable()
export class OrdersService {
  // URL apuntando a tu ms-orders (NestJS en puerto 3003 con prefijo api)
  private readonly ordersMicroserviceUrl = 'http://localhost:3003/api/orders';
  private readonly inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';

  constructor(
    private readonly httpService: HttpService,
    private readonly breakerService: CircuitBreakerService
  ) {}

  async getOrdersHistory() {
    try {
      // Obtener el listado de órdenes crudo desde ms-orders
      const orders = await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-GET-ALL',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(this.ordersMicroserviceUrl)
          );
          return data;
        },
        async () => []
      );

      if (!orders || orders.length === 0) return [];

      // Extraer todos los productIds únicos de todas las órdenes para no duplicar llamadas HTTP innecesarias
      const allProductIds: number[] = Array.from(
        new Set(orders.flatMap((order: any) => (order.items || []).map((item: any) => item.productId)))
      );

      // Consultar la información de esos productos en ms-inventory (Protegido con el Circuit Breaker)
      const productsMap = await this.breakerService.runWithCircuitBreaker(
        'MS-INVENTORY-BULK-GET',
        async () => {
          const productPromises = allProductIds.map(async (id) => {
            try {
              const { data } = await firstValueFrom(
                this.httpService.get(`${this.inventoryMicroserviceUrl}/items/${id}`)
              );
              // Solo guardamos lo que necesitas: id, name y sku
              return { id: data.id, name: data.name, sku: data.sku };
            } catch (err) {
              // Si un producto individual falla o fue borrado, retornamos datos de emergencia
              return { id, name: 'Producto no disponible', sku: 'N/A' };
            }
          });
          const resolvedProducts = await Promise.all(productPromises);
          
          // Lo convertimos en un mapa clave-valor para buscar a O(1) eficientemente
          return new Map(resolvedProducts.map(p => [p.id, p]));
        },
        async () => {
          console.error('[BFF Fallback] ms-inventory inaccesible al listar órdenes.');
          return new Map();
        }
      );

      // Hidratar e integrar los datos del producto dentro de cada item de la orden
      return orders.map((order: any) => ({
        ...order,
        items: (order.items || []).map((item: any) => ({
          ...item,
          product: productsMap.get(item.productId) || { id: item.productId, name: 'Desconocido', sku: 'N/A' }
        }))
      }));

    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Error al consolidar el historial de órdenes con productos en el BFF'
      );
    }
  }

  async getOrderById(orderId: number) {
    try {
      // Obtener la orden específica desde ms-orders
      const order = await this.breakerService.runWithCircuitBreaker(
        'MS-ORDERS-GET-BY-ID',
        async () => {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.ordersMicroserviceUrl}/${orderId}`)
          );
          return data;
        },
        async () => {
          throw new ServiceUnavailableException('Servicio de órdenes no disponible.');
        }
      );

      if (!order || !order.items || order.items.length === 0) {
        return { ...order, items: [] };
      }

      // Hidratar los ítems de esta orden única consultando a ms-inventory
      const itemPromises = order.items.map(async (item: any) => {
        try {
          const { data } = await firstValueFrom(
            this.httpService.get(`${this.inventoryMicroserviceUrl}/items/${item.productId}`)
          );
          return {
            ...item,
            product: {
              id: data.id,
              sku: data.sku,
              name: data.name
            }
          };
        } catch (error) {
          return {
            ...item,
            product: { id: item.productId, name: 'Producto no disponible', sku: 'N/A' }
          };
        }
      });

      const hydratedItems = await Promise.all(itemPromises);

      return {
        ...order,
        items: hydratedItems
      };

    } catch (error: any) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new InternalServerErrorException(
        error.response?.data?.message || `Error al consolidar la orden #${orderId} con sus productos`
      );
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
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