import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateUserDto {
  @ApiProperty({ example: 'usuario@smartlogix.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({ example: '123456', description: 'Contraseña de acceso (mínimo 6 caracteres)' })
  @IsNotEmpty()
  password: string;
}