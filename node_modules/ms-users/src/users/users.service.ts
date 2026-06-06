// apps/ms-users/src/users/users.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findAll(){
    try {
      const users = await this.userRepository.find();
      console.log(users)
      return users;
    } catch (error) {
      return `Error interno del servidor ${error}`
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      return user;
    } catch (error) {
      return `Error interno del servidor ${error}`
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { id }
      });

      if (!userExists) {
        throw new NotFoundException(`El usuario con ID ${id} no existe`);
      }

      if (updateUserDto.email === '') delete updateUserDto.email;
      if (updateUserDto.password === '') delete updateUserDto.password;

      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt(10);
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
      }

      const userUpdated = Object.assign(userExists, updateUserDto);

      await this.userRepository.save(userUpdated);

      delete userUpdated.password;

      return userUpdated;      
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Cualquier otro error de PostgreSQL (como un email duplicado) será 500
      throw new InternalServerErrorException(`Error interno del servidor: ${error.message || error}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { id }
      })

      if (!userExists) {
        // Lanza un error 404 estructurado
        throw new NotFoundException(`El usuario con ID ${id} no existe`);
      }

      await this.userRepository.delete(id);

      return { 
        message: 'Usuario eliminado con éxito',
        id 
      };
        
    } catch (error: any) {
       if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Cualquier otro error de PostgreSQL sera 500
      throw new InternalServerErrorException(`Error interno del servidor: ${error.message || error}`)
    }
  }
}