import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@smartlogix.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de acceso (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 3, description: 'ID del Rol dentro del sistema (1: ADMIN, 2: OPERATOR, 3: CLIENT)', required: false })
  @IsOptional()
  @IsInt({ message: 'El roleId debe ser un número entero' })
  roleId?: number; // Ahora pasamos el ID numérico
}