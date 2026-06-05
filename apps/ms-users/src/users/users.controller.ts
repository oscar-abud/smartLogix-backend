import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // Ruta interna: http://localhost:3001/api/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('')
  async findAll(){
    return this.usersService.findAll()
  }

  @ApiBearerAuth()
  @Get(':id')
  async findUser(@Param('id') id: string){
    return this.usersService.getUser(id);
  }

  @Post('login')
  async validateUser(@Body() validateUserDto: ValidateUserDto) {
    return this.usersService.validateUserCredentials(validateUserDto);
  }

  @Post('register')
  async registerUser(@Body() registerUserDto: CreateUserDto) {
    return this.usersService.registerUser(registerUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}