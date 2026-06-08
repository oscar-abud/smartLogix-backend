import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { RegisterDto } from './register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'nueva_password123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'cambio@smartlogix.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 3, required: false, description: 'ID del nuevo almacén a vincular' })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del almacén debe ser un número válido' })
  inventoryId?: number;
}