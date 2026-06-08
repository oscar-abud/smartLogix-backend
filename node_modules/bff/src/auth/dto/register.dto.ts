import { IsEmail, IsNotEmpty, IsOptional, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'operador@smartlogix.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({ example: { id: 2 } })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role!: {
    id: number;
  };

  @ApiProperty({ example: 2, required: false, description: 'ID del almacén opcional a vincular' })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del almacén debe ser un número válido' })
  inventoryId?: number;
}