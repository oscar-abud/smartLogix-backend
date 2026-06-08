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
let InventoryService = class InventoryService {
    inventoryRepository;
    dataSource;
    constructor(inventoryRepository, dataSource) {
        this.inventoryRepository = inventoryRepository;
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
    async getAll() {
        try {
            const inventories = await this.inventoryRepository.find();
            return inventories;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error al obtener almacenes: ${error.message}`);
        }
    }
    async getInventory(id) {
        try {
            const inventory = await this.inventoryRepository.findOne({
                where: { id },
                relations: {
                    items: true,
                },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`El almacén con ID ${id} no existe`);
            }
            return inventory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error al obtener el almacén: ${error.message}`);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map