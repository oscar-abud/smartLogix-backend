import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Ruta interna: http://localhost:3001/api/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAll(){
    return this.usersService.findAll()
  }

  @Post('validate')
  async validateUser(@Body() validateUserDto: ValidateUserDto) {
    return this.usersService.validateUserCredentials(validateUserDto);
  }

  @Post('register')
  async registerUser(@Body() registerUserDto: CreateUserDto) {
    return this.usersService.registerUser(registerUserDto);
  }
}