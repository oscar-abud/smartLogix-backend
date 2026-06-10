import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders') // URL Base en tu BFF: http://localhost:3000/api/orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
  @ApiOperation({ summary: 'Generar una nueva orden de compra y rebajar stock de inventario' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Listar el historial completo de órdenes generadas' })
  async findAll() {
    return this.ordersService.getOrdersHistory();
  }
}