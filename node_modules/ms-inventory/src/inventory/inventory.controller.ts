import { Controller, Get, Post, Delete, Param, Body, Headers, ParseIntPipe, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation } from '@nestjs/swagger';

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

  @Post(':inventoryId/users') // Escucha: POST http://localhost:3002/api/inventory/:inventoryId/users
  async assignUserToInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Headers('x-user-id') userId: string,
  ) {
    // Registra la relación física en la tabla intermedia (Cuando creas un usuario)
    return this.inventoryService.assignUser(inventoryId, userId);
  }

  @Patch(':inventoryId/users') // Escucha: PATCH http://localhost:3002/api/inventory/:inventoryId/users
  async updateUserInventoryRelation(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Headers('x-user-id') userId: string,
  ) {
    // Actualiza o reemplaza la relación (Cuando editas un usuario y lo cambias de almacén)
    return this.inventoryService.updateUserRelation(inventoryId, userId);
  }

  @Delete(':inventoryId/users/:userId')
  async removeUserFromInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('userId') userId: string,
  ) {
    console.log('[Microservicio] ID de usuario recibido para desvincular:', userId);
    return this.inventoryService.removeUserRelation(inventoryId, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventory(id);
  }
}