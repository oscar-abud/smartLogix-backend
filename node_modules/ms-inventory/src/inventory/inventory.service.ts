import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { UserInventory } from './entities/user-inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  async registerInventory(createInventoryDto: CreateInventoryDto, creatorUserId: string) {
    const { name, description } = createInventoryDto;

    const inventoryExists = await this.inventoryRepository.findOne({ where: { name } });
    if (inventoryExists) {
      throw new BadRequestException('Ya existe un almacén registrado con este nombre');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newInventory = queryRunner.manager.create(Inventory, {
        name,
        description,
      });
      const inventorySaved = await queryRunner.manager.save(Inventory, newInventory);

      const userAssignment = queryRunner.manager.create(UserInventory, {
        userId: creatorUserId,            // UUID que vendrá desde el BFF
        inventoryId: inventorySaved.id,   // ID numérico autoincremental recién generado
      });
      await queryRunner.manager.save(UserInventory, userAssignment);

      await queryRunner.commitTransaction();

      return inventorySaved;

    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Error al registrar el almacén y asignar usuario: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getAll() {
    try {
      const inventoriesRaw = await this.inventoryRepository.createQueryBuilder('inventory')
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(item.id)', 'totalItems')
            .from('inventory_items', 'item')
            .where('item.inventory_id = inventory.id');
        }, 'totalItems')
        .addSelect((subQuery) => {
          return subQuery
            .select("COALESCE(json_agg(user_inv.user_id) FILTER (WHERE user_inv.user_id IS NOT NULL), '[]')", 'userIds')
            .from('user_inventories', 'user_inv')
            .where('user_inv.inventory_id = inventory.id');
        }, 'userIds')
        .orderBy('inventory.id', 'ASC')
        .getRawAndEntities();

      // El microservicio solo estructura su data local y la escupe inmediatamente
      return inventoriesRaw.entities.map((inventory, index) => {
        const raw = inventoriesRaw.raw[index];
        const userIdsArray: string[] = typeof raw.userIds === 'string' 
          ? JSON.parse(raw.userIds) 
          : (raw.userIds || []);

        return {
          ...inventory,
          totalItems: raw.totalItems ? parseInt(raw.totalItems, 10) : 0,
          totalUsers: userIdsArray.length,
          userIds: userIdsArray,
        };
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`Error base en ms-inventory: ${error.message}`);
    }
  }

  async getInventory(id: number) {
    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { id },
        relations: {
          items: true,
        },
      });

      if (!inventory) {
        throw new NotFoundException(`El almacén con ID ${id} no existe`);
      }

      return inventory;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error al obtener el almacén: ${error.message}`);
    }
  }

  async deleteInventory(id: number) {
    try {
      const inventoryExists = await this.inventoryRepository.findOne({
        where: { id }
      });

      if (!inventoryExists) {
        throw new NotFoundException(`El almacén con ID ${id} no existe`);
      }

      await this.inventoryRepository.delete(id);

      return { 
        message: 'Almacén y sus dependencias eliminados con éxito',
        id 
      };
        
    } catch (error: any) {
       if (error instanceof NotFoundException) throw error;
       throw new InternalServerErrorException(`Error interno del servidor al eliminar: ${error.message}`)
    }
  }
}