import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory') // URL Base en el BFF: http://localhost:3000/api/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  @ApiOperation({ summary: 'Listar todos los almacenes de inventario' })
  async findAll() {
    return this.inventoryService.getAll();
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
    console.log('ID del usuario extraído con éxito:', userId);
    
    return this.inventoryService.createInventory(createInventoryDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un almacén del inventario' })
  async deleteInventory(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventory(id);
  }
}