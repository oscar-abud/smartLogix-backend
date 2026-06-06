// apps/ms-users/src/users/users.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(registerDto: CreateUserDto) {
    const { email, password, role } = registerDto;

    // Verificar si el correo ya está registrado
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || 'client',
    });

    const userSaved = await this.userRepository.save(newUser);

    const { password: _, ...result } = userSaved;
    return result;
  }

  async validateUserCredentials(validateUserDto: ValidateUserDto) {
    const { email, password } = validateUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Contraseña incorrecta o usuario inexistente');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta o usuario inexistente');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}