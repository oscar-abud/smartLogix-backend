import { IsNotEmpty, IsNumber, IsPositive, IsArray, ValidateNested, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingOrderItemDto {
  @ApiProperty({ example: 10, description: 'ID del ítem dentro de la orden' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 5, description: 'ID de la orden a la que pertenece' })
  @IsNumber()
  @IsNotEmpty()
  orderId!: number;

  @ApiProperty({ example: 4, description: 'ID del producto en catálogo' })
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @ApiProperty({ example: 7, description: 'Cantidad física de unidades vendidas' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ example: '2990.00', description: 'Precio unitario del producto' })
  @IsString()
  @IsNotEmpty()
  price!: string;
}

// Sub-DTO para la cabecera de la orden
export class ShippingOrderDataDto {
  @ApiProperty({ example: 5, description: 'ID numérico de la orden' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'PENDING', description: 'Estado actual de la orden' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ example: '55430.00', description: 'Monto total de la compra' })
  @IsString()
  @IsNotEmpty()
  totalAmount!: string;

  @ApiProperty({ example: '2026-06-12T09:45:36.944Z', description: 'Fecha de creación ISO' })
  @IsString()
  @IsNotEmpty()
  createdAt!: string;

  @ApiProperty({ type: [ShippingOrderItemDto], description: 'Listado de productos asociados a la orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingOrderItemDto)
  @IsNotEmpty()
  items!: ShippingOrderItemDto[];
}

// 3. Sub-DTO para los datos manuales del modal geográfico
export class FormManualDataDto {
  @ApiProperty({ example: 'Oscar Palma', description: 'Nombre completo de la persona que recibe el paquete' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del receptor es obligatorio.' })
  recipientName!: string;

  @ApiProperty({ example: 'Av. Ricardo Cumming 123', description: 'Dirección física del domicilio' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección de despacho es obligatoria.' })
  shippingAddress!: string;

  @ApiProperty({ example: 'Santiago Centro', description: 'Comuna o sector logístico' })
  @IsString()
  @IsNotEmpty({ message: 'La comuna es obligatoria.' })
  shippingDistrict!: string;

  @ApiProperty({ example: 'Santiago', description: 'Ciudad geográfica' })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  shippingCity!: string;
}

// 4. DTO Principal que recibe el controlador del BFF
export class CreateShippingDto {
  @ApiProperty({ type: ShippingOrderDataDto, description: 'Datos del microservicio de órdenes' })
  @ValidateNested()
  @Type(() => ShippingOrderDataDto)
  @IsNotEmpty()
  order!: ShippingOrderDataDto;

  @ApiProperty({ type: FormManualDataDto, description: 'Datos geográficos rellenados en el modal por el usuario' })
  @ValidateNested()
  @Type(() => FormManualDataDto)
  @IsNotEmpty()
  formManualData!: FormManualDataDto;
}