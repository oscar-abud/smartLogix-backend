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
exports.UpdateShippingStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateShippingStatusDto {
    status;
}
exports.UpdateShippingStatusDto = UpdateShippingStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'IN_TRANSIT',
        description: 'Estado logístico del envío',
        enum: ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'],
    }),
    (0, class_validator_1.IsEnum)(['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'], {
        message: 'El estado logístico debe ser uno de los siguientes: PREPARING, IN_TRANSIT, DELIVERED o FAILED.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado del envío no puede enviarse vacío.' }),
    __metadata("design:type", String)
], UpdateShippingStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-shipping-status.dto.js.map