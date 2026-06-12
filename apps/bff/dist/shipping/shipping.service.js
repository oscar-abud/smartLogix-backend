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
exports.ShippingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ShippingService = class ShippingService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    microserviceUrl = 'http://localhost:3004/api/shipping';
    async getAllShippings() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.microserviceUrl));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('No se pudo obtener el listado de despachos.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByOrderId(orderId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.microserviceUrl}/${orderId}`));
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                throw new common_1.HttpException(`No hay despacho registrado para la orden #${orderId}`, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Error al buscar el despacho por orden.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createShipping(payload) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.microserviceUrl, payload));
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.error || 'Error en el microservicio de envíos', error.response.status);
            }
            throw new common_1.HttpException('El microservicio de despachos (Express) no está disponible.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async updateShippingStatus(orderId, status) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.microserviceUrl}/${orderId}/status`, { status }));
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.error || 'Error al actualizar el estado', error.response.status);
            }
            throw new common_1.HttpException('Error interno al actualizar el estado del despacho.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteShipping(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.microserviceUrl}/${id}`));
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                throw new common_1.HttpException(`El envío con ID ${id} no existe o ya fue removido.`, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Error interno al intentar eliminar el registro de despacho.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map