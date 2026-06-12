import { IsNotEmpty, IsNumber, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO para validar cada ítem enviado de forma individual
export class OrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID único del producto existente en el inventario',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  productId!: number;

  @ApiProperty({
    example: 3,
    description: 'Cantidad física de unidades que se desea comprar',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad solicitada es obligatoria.' })
  quantity!: number;
}

// DTO raíz de la Orden
export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    description: 'Arreglo de productos con sus respectivas cantidades a comprar',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty({ message: 'El listado de ítems no puede estar vacío.' })
  items!: OrderItemDto[];
}