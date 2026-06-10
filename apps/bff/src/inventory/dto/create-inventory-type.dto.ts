import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryTypeDto {
  @ApiProperty({ 
    example: 'Inventario C (Tecnología)', 
    description: 'Nombre identificatorio único del tipo de inventario' 
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' })
  name!: string;

  @ApiProperty({ 
    example: 'Dispositivos electrónicos, componentes de hardware y repuestos tecnológicos.', 
    description: 'Detalle o alcance de los insumos pertenecientes a esta categoría',
    required: false 
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;
}