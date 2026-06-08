import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ 
    example: 'Almacén Central Norte', 
    description: 'Nombre descriptivo del nuevo almacén o bodega' 
  })
  @IsString({ message: 'El nombre del inventario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del inventario es obligatorio.' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' })
  name!: string;

  @ApiProperty({ 
    example: 'Bodega principal destinada a productos de alta tecnología y servidores.', 
    description: 'Detalles adicionales sobre el uso o ubicación del almacén',
    required: false 
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional() // Al igual que en PostgreSQL, este campo permite valores nulos
  description?: string;
}