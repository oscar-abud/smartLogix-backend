import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe, Headers, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { AuthService } from '../auth/auth.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory') // URL Base en el BFF: http://localhost:3000/api/inventory
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly authService: AuthService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Listar todos los almacenes de inventario' })
  async findAll() {
    return this.inventoryService.getAll();
  }

  @Get('types')
  @ApiOperation({ summary: 'Obtener el catálogo completo de tipos de inventario para desplegar en Selects' })
  async findAllTypes() {
    return this.inventoryService.getAllTypes();
  }

  @Get('items/:itemId')
  @ApiOperation({ summary: 'Obtener el detalle de un producto individual por su ID para validaciones internas' })
  async findItemById(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.inventoryService.getItemById(itemId);
  }

  @Get('items')
  @ApiOperation({ summary: 'Obtener los detalles de todos los items de inventario' })
  async findItems() {
    return this.inventoryService.getItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un almacén por su ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getInventory(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Registrar un nuevo almacén de inventario' })
  async createInventory(
    @Body() createInventoryDto: CreateInventoryDto,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    return this.inventoryService.createInventory(createInventoryDto, userId);
  }

  @Post('types')
  @ApiOperation({ summary: 'Registrar una nueva categoría o tipo de inventario global' })
  async createType(@Body() createInventoryTypeDto: CreateInventoryTypeDto) {
    return this.inventoryService.createType(createInventoryTypeDto);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Registrar y asociar un nuevo producto/ítem a un almacén específico' })
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() createItemDto: CreateItemDto
  ) {
    return this.inventoryService.addItemToInventory(id, createItemDto);
  }

  @Patch('items/:itemId/stock')
  @ApiOperation({ summary: 'Modificar de forma atómica el stock disponible de un producto (Suma o Resta)' })
  @ApiBearerAuth()
  async updateStock(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateStockDto: UpdateStockDto
  ) {
    return this.inventoryService.updateItemStock(itemId, updateStockDto);
  }

  @Delete(':inventoryId/users/:userId')
  @ApiOperation({ summary: 'Desvincular a un usuario de un almacén' })
  async unlinkUserFromInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('userId') userId: string,
  ) {
    return this.authService.unlinkUserFromInventory(inventoryId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un almacén del inventario' })
  async deleteInventory(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventory(id);
  }
}