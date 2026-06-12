"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
const user_inventory_entity_1 = require("./entities/user-inventory.entity");
const inventory_item_entity_1 = require("./entities/inventory-item.entity");
const inventory_type_entity_1 = require("./entities/inventory-type.entity");
let InventoryService = class InventoryService {
    inventoryRepository;
    itemRepository;
    typeRepository;
    dataSource;
    constructor(inventoryRepository, itemRepository, typeRepository, dataSource) {
        this.inventoryRepository = inventoryRepository;
        this.itemRepository = itemRepository;
        this.typeRepository = typeRepository;
        this.dataSource = dataSource;
    }
    async registerInventory(createInventoryDto, creatorUserId) {
        const { name, description } = createInventoryDto;
        const inventoryExists = await this.inventoryRepository.findOne({ where: { name } });
        if (inventoryExists) {
            throw new common_1.BadRequestException('Ya existe un almacén registrado con este nombre');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newInventory = queryRunner.manager.create(inventory_entity_1.Inventory, {
                name,
                description,
            });
            const inventorySaved = await queryRunner.manager.save(inventory_entity_1.Inventory, newInventory);
            const userAssignment = queryRunner.manager.create(user_inventory_entity_1.UserInventory, {
                userId: creatorUserId,
                inventoryId: inventorySaved.id,
            });
            await queryRunner.manager.save(user_inventory_entity_1.UserInventory, userAssignment);
            await queryRunner.commitTransaction();
            return inventorySaved;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException(`Error al registrar el almacén y asignar usuario: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async addItemToInventory(inventoryId, createItemDto) {
        try {
            const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
            if (!inventory) {
                throw new common_1.NotFoundException(`El almacén con ID ${inventoryId} no existe`);
            }
            const skuExists = await this.itemRepository.findOne({ where: { sku: createItemDto.sku } });
            if (skuExists) {
                throw new common_1.BadRequestException(`El producto con SKU '${createItemDto.sku}' ya está registrado`);
            }
            const newItem = this.itemRepository.create({
                ...createItemDto,
                inventoryId: inventoryId,
                stockReserved: createItemDto.stockReserved || 0,
            });
            return await this.itemRepository.save(newItem);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Error al registrar el producto en el almacén: ${error.message}`);
        }
    }
    async createInventoryType(createInventoryTypeDto) {
        const { name } = createInventoryTypeDto;
        try {
            const typeExists = await this.typeRepository.findOne({ where: { name } });
            if (typeExists) {
                throw new common_1.BadRequestException(`El tipo de inventario '${name}' ya está registrado.`);
            }
            const newType = this.typeRepository.create(createInventoryTypeDto);
            return await this.typeRepository.save(newType);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error al registrar el tipo de inventario: ${error.message}`);
        }
    }
    async getAll() {
        try {
            const inventoriesRaw = await this.inventoryRepository.createQueryBuilder('inventory')
                .leftJoinAndSelect('inventory.items', 'item')
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
            return inventoriesRaw.entities.map((inventory) => {
                const raw = inventoriesRaw.raw.find(r => r.inventory_id === inventory.id) || {};
                const userIdsArray = typeof raw.userIds === 'string'
                    ? JSON.parse(raw.userIds)
                    : (raw.userIds || []);
                return {
                    ...inventory,
                    items: inventory.items || [],
                    totalItems: raw.totalItems ? parseInt(raw.totalItems, 10) : 0,
                    totalUsers: userIdsArray.length,
                    userIds: userIdsArray,
                };
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error base en ms-inventory: ${error.message}`);
        }
    }
    async getInventory(id) {
        try {
            const inventoryRaw = await this.inventoryRepository.createQueryBuilder('inventory')
                .leftJoinAndSelect('inventory.items', 'item')
                .where('inventory.id = :id', { id })
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
            if (!inventoryRaw.entities || inventoryRaw.entities.length === 0) {
                throw new common_1.NotFoundException(`El almacén con ID ${id} no existe`);
            }
            const inventory = inventoryRaw.entities[0];
            const raw = inventoryRaw.raw[0] || {};
            const userIdsArray = typeof raw.userIds === 'string'
                ? JSON.parse(raw.userIds)
                : (raw.userIds || []);
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error al obtener el almacén en ms-inventory: ${error.message}`);
        }
    }
    async getAllInventoryTypes() {
        try {
            return await this.typeRepository.find({
                order: { id: 'ASC' }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error al obtener los tipos de inventario: ${error.message}`);
        }
    }
    async getItemById(itemId) {
        const item = await this.itemRepository.findOne({
            where: { id: itemId }
        });
        if (!item) {
            throw new common_1.NotFoundException(`El ítem con ID ${itemId} no existe en el inventario.`);
        }
        return item;
    }
    async getItems() {
        const item = await this.itemRepository.find();
        return item;
    }
    async assignUser(inventoryId, userId) {
        await this.inventoryRepository.manager.query(`DELETE FROM user_inventories WHERE user_id = $1 AND inventory_id = $2`, [userId, inventoryId]);
        await this.inventoryRepository.manager.query(`INSERT INTO user_inventories (inventory_id, user_id) VALUES ($1, $2)`, [inventoryId, userId]);
        return { success: true, message: 'Usuario asignado exitosamente al almacén' };
    }
    async updateUserRelation(inventoryId, userId) {
        await this.inventoryRepository.manager.query(`DELETE FROM user_inventories WHERE user_id = $1`, [userId]);
        await this.inventoryRepository.manager.query(`INSERT INTO user_inventories (inventory_id, user_id) VALUES ($1, $2)`, [inventoryId, userId]);
        return { success: true, message: 'Relación de almacén actualizada con éxito' };
    }
    async updateItemStock(itemId, updateStockDto) {
        const { quantity } = updateStockDto;
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException(`El producto con ID ${itemId} no existe en el catálogo.`);
        }
        if (quantity < 0 && (item.stockAvailable + quantity) < 0) {
            throw new common_1.BadRequestException(`Stock insuficiente para realizar la operación. Stock actual: ${item.stockAvailable}, solicitado: ${Math.abs(quantity)}`);
        }
        item.stockAvailable += quantity;
        const updatedItem = await this.itemRepository.save(item);
        return {
            message: quantity < 0 ? 'Stock descontado con éxito' : 'Stock incrementado con éxito',
            itemId: updatedItem.id,
            sku: updatedItem.sku,
            previousStock: item.stockAvailable - quantity,
            newStock: updatedItem.stockAvailable
        };
    }
    async removeUserRelation(inventoryId, userId) {
        try {
            await this.inventoryRepository.manager.query(`DELETE FROM user_inventories WHERE inventory_id = $1 AND user_id = $2`, [inventoryId, userId]);
            return {
                success: true,
                message: `Usuario ${userId} desvinculado con éxito del almacén ${inventoryId}`
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error al eliminar la relación en ms-inventory: ${error.message}`);
        }
    }
    async deleteInventory(id) {
        try {
            const inventoryExists = await this.inventoryRepository.findOne({
                where: { id }
            });
            if (!inventoryExists) {
                throw new common_1.NotFoundException(`El almacén con ID ${id} no existe`);
            }
            await this.inventoryRepository.delete(id);
            return {
                message: 'Almacén y sus dependencias eliminados con éxito',
                id
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error interno del servidor al eliminar: ${error.message}`);
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_type_entity_1.InventoryType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map