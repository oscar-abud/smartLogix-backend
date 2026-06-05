import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('inventory') // Ruta interna: http://localhost:3002/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiBearerAuth()
  @Get('')
  async findAll(){
    return this.inventoryService.getAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  async findUser(@Param('id') id: string){
    return this.inventoryService.getProduct(id);
  }

  @ApiBearerAuth()
  @Post('')
  async createProduct(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.registerInventory(createInventoryDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }
} 
