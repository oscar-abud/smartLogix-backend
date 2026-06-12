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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const create_item_dto_1 = require("./dto/create-item.dto");
const create_inventory_type_dto_1 = require("./dto/create-inventory-type.dto");
const update_stock_dto_1 = require("./dto/update-stock.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async findAll() {
        return this.inventoryService.getAll();
    }
    async getTypes() {
        return this.inventoryService.getAllInventoryTypes();
    }
    async findItemById(itemId) {
        return this.inventoryService.getItemById(itemId);
    }
    async findOne(id) {
        return this.inventoryService.getInventory(id);
    }
    async create(createInventoryDto, userId) {
        return this.inventoryService.registerInventory(createInventoryDto, userId);
    }
    async createType(createInventoryTypeDto) {
        return this.inventoryService.createInventoryType(createInventoryTypeDto);
    }
    async assignUserToInventory(inventoryId, userId) {
        return this.inventoryService.assignUser(inventoryId, userId);
    }
    async addItem(id, createItemDto) {
        return this.inventoryService.addItemToInventory(id, createItemDto);
    }
    async updateUserInventoryRelation(inventoryId, userId) {
        return this.inventoryService.updateUserRelation(inventoryId, userId);
    }
    async updateStock(itemId, updateStockDto) {
        return this.inventoryService.updateItemStock(itemId, updateStockDto);
    }
    async removeUserFromInventory(inventoryId, userId) {
        console.log('[Microservicio] ID de usuario recibido para desvincular:', userId);
        return this.inventoryService.removeUserRelation(inventoryId, userId);
    }
    async delete(id) {
        return this.inventoryService.deleteInventory(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTypes", null);
__decorate([
    (0, common_1.Get)('items/:itemId'),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findItemById", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('types'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_type_dto_1.CreateInventoryTypeDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createType", null);
__decorate([
    (0, common_1.Post)(':inventoryId/users'),
    __param(0, (0, common_1.Param)('inventoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "assignUserToInventory", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':inventoryId/users'),
    __param(0, (0, common_1.Param)('inventoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateUserInventoryRelation", null);
__decorate([
    (0, common_1.Patch)('items/:itemId/stock'),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':inventoryId/users/:userId'),
    __param(0, (0, common_1.Param)('inventoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "removeUserFromInventory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "delete", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map