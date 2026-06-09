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
        // 1. Traemos la relación de los productos mapeada como objeto de forma nativa
        .leftJoinAndSelect('inventory.items', 'item')
        
        // 2. Subconsultas rápidas para los contadores y usuarios asignados
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(subItem.id)', 'totalItems')
            .from('inventory_items', 'subItem')
            .where('subItem.inventory_id = inventory.id');
        }, 'totalItems')
        .addSelect((subQuery) => {
          return subQuery
            .select("COALESCE(json_agg(user_inv.user_id) FILTER (WHERE user_inv.user_id IS NOT NULL), '[]')", 'userIds')
            .from('user_inventories', 'user_inv')
            .where('user_inv.inventory_id = inventory.id');
        }, 'userIds')
        .orderBy('inventory.id', 'ASC')
        .getRawAndEntities();

      // 3. Mapeamos los resultados emparejando la entidad con su data cruda correspondiente
      return inventoriesRaw.entities.map((inventory) => {
        // Buscamos en el arreglo raw el registro que pertenezca a este inventario específico
        const raw = inventoriesRaw.raw.find(r => r.inventory_id === inventory.id) || {};
        
        const userIdsArray: string[] = typeof raw.userIds === 'string' 
          ? JSON.parse(raw.userIds) 
          : (raw.userIds || []);

        return {
          ...inventory,
          items: inventory.items || [], // Si no tiene ítems, se asegura de mandar un array vacío
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
      const inventoryRaw = await this.inventoryRepository.createQueryBuilder('inventory')
        // 1. Traemos la relación de los productos mapeada como objeto de forma nativa
        .leftJoinAndSelect('inventory.items', 'item')
        
        // 2. Filtramos estrictamente por el ID que viene por parámetro
        .where('inventory.id = :id', { id })
        
        // 3. Subconsultas idénticas a las de getAll para totalizadores y userIds
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(subItem.id)', 'totalItems')
            .from('inventory_items', 'subItem')
            .where('subItem.inventory_id = inventory.id');
        }, 'totalItems')
        .addSelect((subQuery) => {
          return subQuery
            .select("COALESCE(json_agg(user_inv.user_id) FILTER (WHERE user_inv.user_id IS NOT NULL), '[]')", 'userIds')
            .from('user_inventories', 'user_inv')
            .where('user_inv.inventory_id = inventory.id');
        }, 'userIds')
        .getRawAndEntities();

      // 4. Validamos si el registro existe en la base de datos
      if (!inventoryRaw.entities || inventoryRaw.entities.length === 0) {
        throw new NotFoundException(`El almacén con ID ${id} no existe`);
      }

      // Extraemos la entidad única y su primer registro crudo correspondiente
      const inventory = inventoryRaw.entities[0];
      const raw = inventoryRaw.raw[0] || {};
      
      // Parseamos el arreglo de UUIDs de usuarios asignados
      const userIdsArray: string[] = typeof raw.userIds === 'string' 
        ? JSON.parse(raw.userIds) 
        : (raw.userIds || []);

      // 5. Retornamos la estructura exacta reflejando el formato empresarial
      return {
        id: inventory.id,
        name: inventory.name,
        description: inventory.description,
        createdAt: inventory.createdAt,
        items: inventory.items || [],
        totalItems: raw.totalItems ? parseInt(raw.totalItems, 10) : 0,
        totalUsers: userIdsArray.length,
        userIds: userIdsArray,
      };

    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error al obtener el almacén en ms-inventory: ${error.message}`);
    }
  }

  async assignUser(inventoryId: number, userId: string) {
    // Ejemplo usando QueryBuilder o repositorio de tu entidad intermedia (user_inventories)
    // Evitamos duplicados limpiando cualquier rastro previo del usuario en este almacén antes de insertar
    await this.inventoryRepository.manager.query(
      `DELETE FROM user_inventories WHERE user_id = $1 AND inventory_id = $2`,
      [userId, inventoryId]
    );

    await this.inventoryRepository.manager.query(
      `INSERT INTO user_inventories (inventory_id, user_id) VALUES ($1, $2)`,
      [inventoryId, userId]
    );

    return { success: true, message: 'Usuario asignado exitosamente al almacén' };
  }

  async updateUserRelation(inventoryId: number, userId: string) {
    // Al actualizar, limpiamos todas las asignaciones antiguas que tenía este usuario
    // para que quede exclusivamente asignado a la nueva bodega seleccionada
    await this.inventoryRepository.manager.query(
      `DELETE FROM user_inventories WHERE user_id = $1`,
      [userId]
    );

    // Insertamos la nueva relación
    await this.inventoryRepository.manager.query(
      `INSERT INTO user_inventories (inventory_id, user_id) VALUES ($1, $2)`,
      [inventoryId, userId]
    );

    return { success: true, message: 'Relación de almacén actualizada con éxito' };
  }

  async removeUserRelation(inventoryId: number, userId: string) {
    try {
      // Eliminamos únicamente el registro relacional que une a este usuario con este almacén
      await this.inventoryRepository.manager.query(
        `DELETE FROM user_inventories WHERE inventory_id = $1 AND user_id = $2`,
        [inventoryId, userId]
      );

      return { 
        success: true, 
        message: `Usuario ${userId} desvinculado con éxito del almacén ${inventoryId}` 
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error al eliminar la relación en ms-inventory: ${error.message}`
      );
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