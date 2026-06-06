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
    const { email, password, roleId } = registerDto;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: { id: roleId || 3 } // Por defecto rol 3 (CLIENT) si no viene
    });

    const userSaved = await this.userRepository.save(newUser);

    return {
      id: userSaved.id,
      email: userSaved.email,
      id_role: userSaved.role.id,
      rol: userSaved.role.name,
      createdAt: userSaved.createdAt
    };
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
      id_role: user.role.id,
      rol: user.role.name,
    };
  }
}