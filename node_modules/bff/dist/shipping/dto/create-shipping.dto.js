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
exports.CreateShippingDto = exports.FormManualDataDto = exports.ShippingOrderDataDto = exports.ShippingOrderItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ShippingOrderItemDto {
    id;
    orderId;
    productId;
    quantity;
    price;
}
exports.ShippingOrderItemDto = ShippingOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'ID del ítem dentro de la orden' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOrderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'ID de la orden a la que pertenece' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOrderItemDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'ID del producto en catálogo' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Cantidad física de unidades vendidas' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2990.00', description: 'Precio unitario del producto' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShippingOrderItemDto.prototype, "price", void 0);
class ShippingOrderDataDto {
    id;
    status;
    totalAmount;
    createdAt;
    items;
}
exports.ShippingOrderDataDto = ShippingOrderDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'ID numérico de la orden' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOrderDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING', description: 'Estado actual de la orden' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShippingOrderDataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '55430.00', description: 'Monto total de la compra' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShippingOrderDataDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-12T09:45:36.944Z', description: 'Fecha de creación ISO' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShippingOrderDataDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ShippingOrderItemDto], description: 'Listado de productos asociados a la orden' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShippingOrderItemDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ShippingOrderDataDto.prototype, "items", void 0);
class FormManualDataDto {
    recipientName;
    shippingAddress;
    shippingDistrict;
    shippingCity;
}
exports.FormManualDataDto = FormManualDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Oscar Palma', description: 'Nombre completo de la persona que recibe el paquete' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del receptor es obligatorio.' }),
    __metadata("design:type", String)
], FormManualDataDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Av. Ricardo Cumming 123', description: 'Dirección física del domicilio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La dirección de despacho es obligatoria.' }),
    __metadata("design:type", String)
], FormManualDataDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Santiago Centro', description: 'Comuna o sector logístico' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La comuna es obligatoria.' }),
    __metadata("design:type", String)
], FormManualDataDto.prototype, "shippingDistrict", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Santiago', description: 'Ciudad geográfica' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La ciudad es obligatoria.' }),
    __metadata("design:type", String)
], FormManualDataDto.prototype, "shippingCity", void 0);
class CreateShippingDto {
    order;
    formManualData;
}
exports.CreateShippingDto = CreateShippingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ShippingOrderDataDto, description: 'Datos del microservicio de órdenes' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ShippingOrderDataDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", ShippingOrderDataDto)
], CreateShippingDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FormManualDataDto, description: 'Datos geográficos rellenados en el modal por el usuario' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FormManualDataDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", FormManualDataDto)
], CreateShippingDto.prototype, "formManualData", void 0);
//# sourceMappingURL=create-shipping.dto.js.map