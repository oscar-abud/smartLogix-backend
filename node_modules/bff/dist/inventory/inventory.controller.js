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
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const inventory_service_1 = require("./inventory.service");
const auth_service_1 = require("../auth/auth.service");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const create_item_dto_1 = require("./dto/create-item.dto");
const create_inventory_type_dto_1 = require("./dto/create-inventory-type.dto");
const update_stock_dto_1 = require("./dto/update-stock.dto");
let InventoryController = class InventoryController {
    inventoryService;
    authService;
    constructor(inventoryService, authService) {
        this.inventoryService = inventoryService;
        this.authService = authService;
    }
    async findAll() {
        return this.inventoryService.getAll();
    }
    async findAllTypes() {
        return this.inventoryService.getAllTypes();
    }
    async findItemById(itemId) {
        return this.inventoryService.getItemById(itemId);
    }
    async findOne(id) {
        return this.inventoryService.getInventory(id);
    }
    async createInventory(createInventoryDto, req) {
        const userId = req.user.userId;
        console.log('ID del usuario extraído con éxito:', userId);
        return this.inventoryService.createInventory(createInventoryDto, userId);
    }
    async createType(createInventoryTypeDto) {
        return this.inventoryService.createType(createInventoryTypeDto);
    }
    async addItem(id, createItemDto) {
        return this.inventoryService.addItemToInventory(id, createItemDto);
    }
    async updateStock(itemId, updateStockDto) {
        return this.inventoryService.updateItemStock(itemId, updateStockDto);
    }
    async unlinkUserFromInventory(inventoryId, userId) {
        return this.authService.unlinkUserFromInventory(inventoryId, userId);
    }
    async deleteInventory(id) {
        return this.inventoryService.deleteInventory(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los almacenes de inventario' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el catálogo completo de tipos de inventario para desplegar en Selects' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAllTypes", null);
__decorate([
    (0, common_1.Get)('items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el detalle de un producto individual por su ID para validaciones internas' }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findItemById", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un almacén por su ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo almacén de inventario' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createInventory", null);
__decorate([
    (0, common_1.Post)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una nueva categoría o tipo de inventario global' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_type_dto_1.CreateInventoryTypeDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createType", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar y asociar un nuevo producto/ítem a un almacén específico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:itemId/stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar de forma atómica el stock disponible de un producto (Suma o Resta)' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':inventoryId/users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Desvincular a un usuario de un almacén' }),
    __param(0, (0, common_1.Param)('inventoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "unlinkUserFromInventory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un almacén del inventario' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "deleteInventory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        auth_service_1.AuthService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map