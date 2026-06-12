import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

@ApiTags('Shipping')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('shipping') // URL Base en tu BFF: http://localhost:3000/api/shipping
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('')
  @ApiOperation({ summary: 'Generar un registro de despacho acoplando la orden con los datos manuales del modal' })
  async create(@Body() createShippingDto: CreateShippingDto) {
    return await this.shippingService.createShipping(createShippingDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Listar el historial completo de despachos registrados en MongoDB Atlas' })
  async findAll() {
    return await this.shippingService.getAllShippings();
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Buscar el estado y datos del despacho asociado a una orden específica por su ID numérico' })
  async findByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.shippingService.getByOrderId(orderId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Actualizar el estado logístico de un despacho (PREPARING ➡️ IN_TRANSIT ➡️ DELIVERED)' })
  async updateStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateShippingStatusDto: UpdateShippingStatusDto,
  ) {
    return await this.shippingService.updateShippingStatus(orderId, updateShippingStatusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar físicamente un registro de despacho usando su ID nativo de MongoDB (Hash alfanumérico)' })
  async remove(@Param('id') id: string) {
    return await this.shippingService.deleteShipping(id); 
  }
}