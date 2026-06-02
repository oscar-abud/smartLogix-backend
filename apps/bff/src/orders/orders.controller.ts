import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt')) // El BFF solo se encarga de proteger la entrada
  @Post()
  async crearOrden(@Body() datosOrden: any) {
    return this.ordersService.redireccionarAMsOrders(datosOrden);
  }
}