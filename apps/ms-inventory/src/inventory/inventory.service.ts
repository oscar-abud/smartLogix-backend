// apps/ms-inventory/src/inventory/inventory.service.ts
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async registerInventory(createInventoryDto: CreateInventoryDto) {
    const { name, description, price, quantity } = createInventoryDto;

    // Verificar si el producto ya está registrado
    const productExists = await this.inventoryRepository.findOne({ where: { name } });
    if (productExists) {
      throw new BadRequestException('El producto ya está registrado');
    }

    const newProduct = this.inventoryRepository.create({
      name,
      price,
      description,
      quantity: quantity || 0,
    });

    const productSaved = await this.inventoryRepository.save(newProduct);

    return productSaved;
  }

  async getAll() {
    try {
      const products = await this.inventoryRepository.find();
      return products;
    } catch (error: any) {
      throw new InternalServerErrorException(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProduct(id: string) {
    try {
      const product = await this.inventoryRepository.findOne({
        where: { id }
      });

      return product;
    } catch (error: any) {
      throw new InternalServerErrorException(`Error al obtener productos: ${error.message}`);
    }
  }

  async deleteProduct(id: string) {
    try {
      const productExists = await this.inventoryRepository.findOne({
        where: { id }
      })

      if (!productExists) {
        // Lanza un error 404 estructurado
        throw new NotFoundException(`El producto con ID ${id} no existe`);
      }

      await this.inventoryRepository.delete(id);

      return { 
        message: 'Producto eliminado con éxito',
        id 
      };
        
    } catch (error: any) {
       if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Cualquier otro error de PostgreSQL sera 500
      throw new InternalServerErrorException(`Error interno del servidor: ${error.message || error}`)
    }
  }
}