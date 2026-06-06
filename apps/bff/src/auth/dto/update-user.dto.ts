// apps/ms-users/src/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString  } from 'class-validator'
import { RegisterDto } from './register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  email?: string;
}