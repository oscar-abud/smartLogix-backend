import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShippingService {
  // Inyectamos el HttpService de NestJS para hacer peticiones internas
  constructor(private readonly httpService: HttpService) {}

  // URL base de tu microservicio Express
  private readonly microserviceUrl = 'http://localhost:3004/api/shipping';

  /**
   * Obtiene todo el historial de despachos desde Express
   */
  async getAllShippings() {
    try {
      const response = await firstValueFrom(this.httpService.get(this.microserviceUrl));
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        'No se pudo obtener el listado de despachos.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca un despacho en Express usando el ID de la orden
   */
  async getByOrderId(orderId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.microserviceUrl}/${orderId}`)
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new HttpException(
          `No hay despacho registrado para la orden #${orderId}`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Error al buscar el despacho por orden.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envía la orden y los datos manuales del modal hacia Express
   */
  async createShipping(payload: { order: any; formManualData: any }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.microserviceUrl, payload)
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error || 'Error en el microservicio de envíos',
          error.response.status,
        );
      }
      throw new HttpException(
        'El microservicio de despachos (Express) no está disponible.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Actualiza el estado logístico de un envío en Express
   */
  async updateShippingStatus(orderId: number, status: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.microserviceUrl}/${orderId}/status`, { status })
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error || 'Error al actualizar el estado',
          error.response.status,
        );
      }
      throw new HttpException(
        'Error interno al actualizar el estado del despacho.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteShipping(id: string) {
    try {
        const response = await firstValueFrom(
        this.httpService.delete(`${this.microserviceUrl}/${id}`)
        );
        return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new HttpException(
          `El envío con ID ${id} no existe o ya fue removido.`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
       'Error interno al intentar eliminar el registro de despacho.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}