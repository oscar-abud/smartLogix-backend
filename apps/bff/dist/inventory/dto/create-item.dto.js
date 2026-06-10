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
exports.CreateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateItemDto {
    sku;
    name;
    price;
    stockAvailable;
    stockReserved;
    inventoryTypeId;
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SUPER-ARROZ-01',
        description: 'Código SKU único comercial para el control e identificación del producto'
    }),
    (0, class_validator_1.IsString)({ message: 'El SKU debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El SKU del producto es obligatorio.' }),
    (0, class_validator_1.Length)(3, 50, { message: 'El SKU debe tener entre 3 y 50 caracteres.' }),
    __metadata("design:type", String)
], CreateItemDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Arroz Grado 1 Extra Largo 1kg',
        description: 'Nombre comercial detallado del artículo'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre del producto debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del producto es obligatorio.' }),
    (0, class_validator_1.Length)(3, 150, { message: 'El nombre del producto debe tener entre 3 y 150 caracteres.' }),
    __metadata("design:type", String)
], CreateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1490.00,
        description: 'Precio unitario del producto con soporte decimal',
        type: Number
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido con hasta 2 decimales.' }),
    (0, class_validator_1.IsPositive)({ message: 'El precio del producto debe ser mayor a cero.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El precio es obligatorio.' }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 150,
        description: 'Cantidad física actual de stock disponible para la venta o despacho en el almacén',
        type: Number
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock disponible debe ser un número entero.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El stock disponible es obligatorio.' }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "stockAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Cantidad de unidades reservadas para órdenes o pedidos en tránsito',
        required: false,
        default: 0,
        type: Number
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock reservado debe ser un número entero.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "stockReserved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID numérico correlativo que identifica la categoría o tipo de inventario (Ej: 1 = Alimentos, 2 = Médico)',
        type: Number
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID del tipo de inventario debe ser un número numérico entero.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de inventario (inventoryTypeId) es obligatorio.' }),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "inventoryTypeId", void 0);
//# sourceMappingURL=create-item.dto.js.map