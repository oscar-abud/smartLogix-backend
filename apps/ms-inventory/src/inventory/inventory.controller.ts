import { Controller, Get, Post, Delete, Param, Body, Headers, ParseIntPipe, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';

@Controller('inventory') // Ruta interna: http://localhost:3002/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  async findAll() {
    return this.inventoryService.getAll();
  }

  @Get('types')
  async getTypes() {
    return this.inventoryService.getAllInventoryTypes();
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

  @Post('types')
  async createType(@Body() createInventoryTypeDto: CreateInventoryTypeDto) {
    return this.inventoryService.createInventoryType(createInventoryTypeDto);
  }

  @Post(':inventoryId/users') // Escucha: POST http://localhost:3002/api/inventory/:inventoryId/users
  async assignUserToInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Headers('x-user-id') userId: string,
  ) {
    // Registra la relación física en la tabla intermedia (Cuando creas un usuario)
    return this.inventoryService.assignUser(inventoryId, userId);
  }

  @Post(':id/items')
  async addItem(
    @Param('id', ParseIntPipe) id: number, // Captura e intercepta el /:id de la URL de forma numérica
    @Body() createItemDto: CreateItemDto
  ) {
    return this.inventoryService.addItemToInventory(id, createItemDto);
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