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
exports.CreateInventoryTypeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInventoryTypeDto {
    name;
    description;
}
exports.CreateInventoryTypeDto = CreateInventoryTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Inventario C (Tecnología)',
        description: 'Nombre identificatorio único del tipo de inventario'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio.' }),
    (0, class_validator_1.Length)(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' }),
    __metadata("design:type", String)
], CreateInventoryTypeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dispositivos electrónicos, componentes de hardware y repuestos tecnológicos.',
        description: 'Detalle o alcance de los insumos pertenecientes a esta categoría',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryTypeDto.prototype, "description", void 0);
//# sourceMappingURL=create-inventory-type.dto.js.map