import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 5,
    description: 'ID único del ítem/producto existente en el catálogo de inventarios',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  productId!: number;

  @ApiProperty({
    example: 3,
    description: 'Cantidad física de unidades que el cliente desea comprar',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad solicitada es obligatoria.' })
  quantity!: number;
}