import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'PROCESSED',
    enum: OrderStatus,
    description: 'Nuevo estado que se le asignará a la orden de compra'
  })
  @IsEnum(OrderStatus, { message: 'El estado proporcionado no es un estado de orden válido (PENDING, PROCESSED, CANCELLED).' })
  @IsNotEmpty({ message: 'El nuevo estado para la orden es obligatorio.' })
  status!: OrderStatus;
}