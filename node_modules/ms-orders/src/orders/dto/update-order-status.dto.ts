import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'PROCESSED',
    enum: OrderStatus,
    description: 'Nuevo estado aplicable a la orden'
  })
  @IsEnum(OrderStatus, { message: 'El estado proporcionado no es válido.' })
  @IsNotEmpty({ message: 'El nuevo estado es obligatorio.' })
  status!: OrderStatus;
}