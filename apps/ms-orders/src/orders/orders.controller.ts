import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener el listado histórico de órdenes', 
    description: 'Retorna todas las órdenes generadas en el sistema ordenadas de forma descendente por fecha de creación, incluyendo el desglose de sus ítems.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Listado histórico devuelto exitosamente.' 
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Generar una nueva orden de compra', 
    description: 'Valida las existencias en el inventario, registra la compra en PostgreSQL y descuenta de forma atómica el stock disponible.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'La orden fue procesada con éxito y el stock físico ha sido actualizado.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Solicitud rechazada. Posible stock insuficiente del artículo o datos de entrada inválidos.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'El producto (productId) seleccionado no existe en el catálogo global de inventarios.' 
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
}