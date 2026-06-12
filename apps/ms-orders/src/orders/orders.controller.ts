import { Controller, Post, Get, Body, HttpCode, HttpStatus, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado histórico de órdenes' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener la órden por ID' })
  findOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOrderById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Generar una nueva orden de compra multi-producto', 
    description: 'Valida las existencias de todos los productos en el inventario, registra la cabecera y el detalle en PostgreSQL de forma atómica.' 
  })
  @ApiResponse({ status: 201, description: 'La orden multi-producto fue procesada con éxito.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente en uno o más artículos.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una orden' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden del sistema por su ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}