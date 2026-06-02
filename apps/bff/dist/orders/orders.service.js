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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let OrdersService = class OrdersService {
    httpService;
    inventoryUrl = 'http://localhost:3001/api/inventory';
    ordersUrl = 'http://localhost:3002/api/orders';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async crearOrdenOrquestada(datosOrden) {
        try {
            const { data: tieneStock } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryUrl}/check-stock/${datosOrden.productoId}`));
            if (!tieneStock) {
                throw new common_1.HttpException('No hay stock disponible para este producto', common_1.HttpStatus.BAD_REQUEST);
            }
            const { data: nuevaOrden } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.ordersUrl, datosOrden));
            return nuevaOrden;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al procesar la orden en el ecosistema', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map