// apps/bff/src/orders/orders.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders') // Ruta: http://localhost:3000/api/orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async crearOrden(@Body() datosOrden: any) {
    return this.ordersService.crearOrdenOrquestada(datosOrden);
  }
}