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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let InventoryService = class InventoryService {
    httpService;
    inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAll() {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.inventoryMicroserviceUrl));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al conectar con el microservicio de inventario');
        }
    }
    async getProduct(id) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/${id}`));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al buscar el producto por ID');
        }
    }
    async createProduct(createInventoryDto) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.inventoryMicroserviceUrl, createInventoryDto));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al crear el producto');
        }
    }
    async deleteProduct(id) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.inventoryMicroserviceUrl}/${id}`));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al eliminar el producto');
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map