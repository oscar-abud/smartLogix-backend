import { Controller, Get, Post, Delete, Param, Body, Headers, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory') // Ruta interna: http://localhost:3002/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  async findAll() {
    return this.inventoryService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getInventory(id);
  }

  @Post('')
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.inventoryService.registerInventory(createInventoryDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventory(id);
  }
}