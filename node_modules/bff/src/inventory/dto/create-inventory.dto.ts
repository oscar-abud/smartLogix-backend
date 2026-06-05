import { IsNotEmpty, IsOptional, IsString, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ example: 'Notebook Acer aspire', description: 'Ingresar nombre de un producto para inventario' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Notebook ultima generación de gama media', description: 'Ingresar nombre descripción de un producto para inventario' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: '545990', description: 'Ingresar precio del producto' })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: '100', description: 'Ingresar cantidad del producto' })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}