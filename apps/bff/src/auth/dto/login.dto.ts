import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'oscar@smartlogix.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  
  @ApiProperty({ example: 'password123', description: 'Contraseña de acceso (mínimo 6 caracteres)' })
  @IsNotEmpty()
  password!: string;
}