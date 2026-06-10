import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ 
    example: -5, 
    description: 'Cantidad de unidades a modificar en el inventario. Valores negativos descuentan stock (ventas) y valores positivos añaden stock (abastecimiento).' 
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número entero válido.' })
  @IsNotEmpty({ message: 'La cantidad de stock a modificar es obligatoria.' })
  quantity!: number;
}