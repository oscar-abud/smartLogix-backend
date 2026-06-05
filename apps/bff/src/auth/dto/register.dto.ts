import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@smartlogix.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de acceso (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'client', description: 'Rol del usuario dentro del sistema', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['client', 'admin'])
  role?: string;
}