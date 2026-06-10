import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ 
    example: 'SUPER-ARROZ-01', 
    description: 'Código SKU único comercial para el control e identificación del producto' 
  })
  @IsString({ message: 'El SKU debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El SKU del producto es obligatorio.' })
  @Length(3, 50, { message: 'El SKU debe tener entre 3 y 50 caracteres.' })
  sku!: string;

  @ApiProperty({ 
    example: 'Arroz Grado 1 Extra Largo 1kg', 
    description: 'Nombre comercial detallado del artículo' 
  })
  @IsString({ message: 'El nombre del producto debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  @Length(3, 150, { message: 'El nombre del producto debe tener entre 3 y 150 caracteres.' })
  name!: string;

  @ApiProperty({ 
    example: 1490.00, 
    description: 'Precio unitario del producto con soporte decimal',
    type: Number
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido con hasta 2 decimales.' })
  @IsPositive({ message: 'El precio del producto debe ser mayor a cero.' })
  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  price!: number;

  @ApiProperty({ 
    example: 150, 
    description: 'Cantidad física actual de stock disponible para la venta o despacho en el almacén',
    type: Number 
  })
  @IsNumber({}, { message: 'El stock disponible debe ser un número entero.' })
  @IsNotEmpty({ message: 'El stock disponible es obligatorio.' })
  stockAvailable!: number;

  @ApiProperty({ 
    example: 0, 
    description: 'Cantidad de unidades reservadas para órdenes o pedidos en tránsito',
    required: false,
    default: 0,
    type: Number
  })
  @IsNumber({}, { message: 'El stock reservado debe ser un número entero.' })
  @IsOptional()
  stockReserved?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID numérico correlativo que identifica la categoría o tipo de inventario (Ej: 1 = Alimentos, 2 = Médico)',
    type: Number 
  })
  @IsNumber({}, { message: 'El ID del tipo de inventario debe ser un número numérico entero.' })
  @IsNotEmpty({ message: 'El tipo de inventario (inventoryTypeId) es obligatorio.' })
  inventoryTypeId!: number;
}