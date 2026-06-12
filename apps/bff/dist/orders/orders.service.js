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
const circuit_breaker_service_1 = require("../common/circuit-breaker.service");
let OrdersService = class OrdersService {
    httpService;
    breakerService;
    ordersMicroserviceUrl = 'http://localhost:3003/api/orders';
    inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';
    constructor(httpService, breakerService) {
        this.httpService = httpService;
        this.breakerService = breakerService;
    }
    async getOrdersHistory() {
        try {
            const orders = await this.breakerService.runWithCircuitBreaker('MS-ORDERS-GET-ALL', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.ordersMicroserviceUrl));
                return data;
            }, async () => []);
            if (!orders || orders.length === 0)
                return [];
            const allProductIds = Array.from(new Set(orders.flatMap((order) => (order.items || []).map((item) => item.productId))));
            const productsMap = await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-BULK-GET', async () => {
                const productPromises = allProductIds.map(async (id) => {
                    try {
                        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/items/${id}`));
                        return { id: data.id, name: data.name, sku: data.sku };
                    }
                    catch (err) {
                        return { id, name: 'Producto no disponible', sku: 'N/A' };
                    }
                });
                const resolvedProducts = await Promise.all(productPromises);
                return new Map(resolvedProducts.map(p => [p.id, p]));
            }, async () => {
                console.error('[BFF Fallback] ms-inventory inaccesible al listar órdenes.');
                return new Map();
            });
            return orders.map((order) => ({
                ...order,
                items: (order.items || []).map((item) => ({
                    ...item,
                    product: productsMap.get(item.productId) || { id: item.productId, name: 'Desconocido', sku: 'N/A' }
                }))
            }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al consolidar el historial de órdenes con productos en el BFF');
        }
    }
    async getOrderById(orderId) {
        try {
            const order = await this.breakerService.runWithCircuitBreaker('MS-ORDERS-GET-BY-ID', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.ordersMicroserviceUrl}/${orderId}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('Servicio de órdenes no disponible.');
            });
            if (!order || !order.items || order.items.length === 0) {
                return { ...order, items: [] };
            }
            const itemPromises = order.items.map(async (item) => {
                try {
                    const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/items/${item.productId}`));
                    return {
                        ...item,
                        product: {
                            id: data.id,
                            sku: data.sku,
                            name: data.name
                        }
                    };
                }
                catch (error) {
                    return {
                        ...item,
                        product: { id: item.productId, name: 'Producto no disponible', sku: 'N/A' }
                    };
                }
            });
            const hydratedItems = await Promise.all(itemPromises);
            return {
                ...order,
                items: hydratedItems
            };
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || `Error al consolidar la orden #${orderId} con sus productos`);
        }
    }
    async createOrder(createOrderDto) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-ORDERS-CREATE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.ordersMicroserviceUrl, createOrderDto));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de procesamiento de órdenes no está disponible temporalmente. La compra no pudo ser completada.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al procesar la creación de la orden en el BFF');
        }
    }
    async updateOrderStatus(orderId, status) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-ORDERS-UPDATE-STATUS', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.ordersMicroserviceUrl}/${orderId}/status`, { status }));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio de actualización de órdenes está caído. Intente más tarde.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al actualizar la orden en el BFF');
        }
    }
    async deleteOrder(orderId) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-ORDERS-DELETE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.ordersMicroserviceUrl}/${orderId}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio de eliminación de órdenes no está disponible.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al eliminar la orden desde el BFF');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        circuit_breaker_service_1.CircuitBreakerService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map