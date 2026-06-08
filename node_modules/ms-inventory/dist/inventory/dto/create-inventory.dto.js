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
exports.CreateInventoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInventoryDto {
    name;
    description;
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Almacén Central Norte',
        description: 'Nombre descriptivo del nuevo almacén o bodega'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre del inventario debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del inventario es obligatorio.' }),
    (0, class_validator_1.Length)(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bodega principal destinada a productos de alta tecnología y servidores.',
        description: 'Detalles adicionales sobre el uso o ubicación del almacén',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "description", void 0);
//# sourceMappingURL=create-inventory.dto.js.map