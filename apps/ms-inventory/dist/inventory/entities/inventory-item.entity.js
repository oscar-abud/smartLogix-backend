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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryItem = void 0;
const typeorm_1 = require("typeorm");
const inventory_type_entity_1 = require("./inventory-type.entity");
const inventory_entity_1 = require("./inventory.entity");
let InventoryItem = class InventoryItem {
    id;
    sku;
    name;
    price;
    stockAvailable;
    stockReserved;
    inventoryTypeId;
    inventoryId;
    createdAt;
    inventoryType;
    inventory;
};
exports.InventoryItem = InventoryItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], InventoryItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], InventoryItem.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], InventoryItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_available', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "stockAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_reserved', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "stockReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_type_id', type: 'int' }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "inventoryTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_id', type: 'int' }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "inventoryId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdat' }),
    __metadata("design:type", Date)
], InventoryItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_type_entity_1.InventoryType, (type) => type.items, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'inventory_type_id' }),
    __metadata("design:type", inventory_type_entity_1.InventoryType)
], InventoryItem.prototype, "inventoryType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_entity_1.Inventory, (inventory) => inventory.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'inventory_id' }),
    __metadata("design:type", inventory_entity_1.Inventory)
], InventoryItem.prototype, "inventory", void 0);
exports.InventoryItem = InventoryItem = __decorate([
    (0, typeorm_1.Entity)('inventory_items')
], InventoryItem);
//# sourceMappingURL=inventory-item.entity.js.map