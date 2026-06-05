// apps/bff/src/inventory/inventory.controller.ts
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service'; // Asegúrate de importar tu servicio del BFF
import { CreateInventoryDto } from './dto/create-inventory.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory') // URL Base en el BFF: http://localhost:3000/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  @ApiOperation({ summary: 'Listar todos los productos del inventario' })
  async findAll() {
    return this.inventoryService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  async findOne(@Param('id') id: string) {
    return this.inventoryService.getProduct(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Registrar un nuevo producto en el inventario' })
  async createProduct(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.createProduct(createInventoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto del inventario' })
  async deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }
}