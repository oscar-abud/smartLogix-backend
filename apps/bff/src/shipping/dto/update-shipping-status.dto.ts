import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingStatusDto {
  @ApiProperty({
    example: 'IN_TRANSIT',
    description: 'Estado logístico del envío',
    enum: ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'],
  })
  @IsEnum(['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'], {
    message: 'El estado logístico debe ser uno de los siguientes: PREPARING, IN_TRANSIT, DELIVERED o FAILED.',
  })
  @IsNotEmpty({ message: 'El estado del envío no puede enviarse vacío.' })
  status!: string;
}