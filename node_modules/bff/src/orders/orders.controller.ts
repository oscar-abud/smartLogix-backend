import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get('')
  @ApiOperation({ summary: 'Listar el historial completo de órdenes generadas' })
  async findAll() {
    return this.ordersService.getOrdersHistory();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una orden específica por su ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Generar una nueva orden de compra y rebajar stock de inventario' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }
}