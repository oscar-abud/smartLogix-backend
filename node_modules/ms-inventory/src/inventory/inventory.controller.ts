import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory') // Ruta interna: http://localhost:3002/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  async findAll(){
    return this.inventoryService.getAll();
  }

  @Get(':id')
  async findUser(@Param('id') id: string){
    return this.inventoryService.getProduct(id);
  }

  @Post('')
  async createProduct(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.registerInventory(createInventoryDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }
} 
