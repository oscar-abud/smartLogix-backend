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
exports.UserInventory = void 0;
const typeorm_1 = require("typeorm");
const inventory_entity_1 = require("./inventory.entity");
let UserInventory = class UserInventory {
    id;
    userId;
    inventoryId;
    assignedAt;
    inventory;
};
exports.UserInventory = UserInventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], UserInventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserInventory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_id', type: 'int' }),
    __metadata("design:type", Number)
], UserInventory.prototype, "inventoryId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'assigned_at' }),
    __metadata("design:type", Date)
], UserInventory.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_entity_1.Inventory, (inventory) => inventory.userAssignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'inventory_id' }),
    __metadata("design:type", inventory_entity_1.Inventory)
], UserInventory.prototype, "inventory", void 0);
exports.UserInventory = UserInventory = __decorate([
    (0, typeorm_1.Entity)('user_inventories'),
    (0, typeorm_1.Unique)(['userId', 'inventoryId'])
], UserInventory);
//# sourceMappingURL=user-inventory.entity.js.map