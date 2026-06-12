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
const circuit_breaker_service_1 = require("../common/circuit-breaker.service");
let InventoryService = class InventoryService {
    httpService;
    breakerService;
    inventoryMicroserviceUrl = 'http://localhost:3002/api/inventory';
    usersMicroserviceUrl = 'http://localhost:3001/api/users';
    constructor(httpService, breakerService) {
        this.httpService = httpService;
        this.breakerService = breakerService;
    }
    async getAll() {
        try {
            const { data: localInventories } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.inventoryMicroserviceUrl));
            if (!Array.isArray(localInventories) || localInventories.length === 0) {
                return [];
            }
            const allUserIds = Array.from(new Set(localInventories.flatMap((inv) => inv.userIds || [])));
            if (allUserIds.length === 0) {
                return localInventories.map((inv) => ({ ...inv, users: [] }));
            }
            const externalUsers = await this.breakerService.runWithCircuitBreaker('MS-USERS-GET-ALL', async () => {
                const userPromises = allUserIds.map(async (id) => {
                    const { data: userData } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersMicroserviceUrl}/${id}`));
                    if (userData) {
                        const { password, createdAt, ...cleanUser } = userData;
                        return cleanUser;
                    }
                    return null;
                });
                const resolved = await Promise.all(userPromises);
                return resolved.filter((user) => user !== null);
            }, async () => {
                console.error('[BFF Fallback - getAll] ms-users inaccesible. Retornando lista sin nombres de operador.');
                return [];
            });
            return localInventories.map((inventory) => {
                return {
                    ...inventory,
                    users: externalUsers.filter((u) => inventory.userIds.includes(u.id)),
                };
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error en el orquestador BFF al consolidar inventarios con usuarios');
        }
    }
    async getInventory(id) {
        try {
            const { data: inventory } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/${id}`));
            if (!inventory || !inventory.userIds || inventory.userIds.length === 0) {
                return { ...inventory, users: [] };
            }
            const externalUsers = await this.breakerService.runWithCircuitBreaker('MS-USERS', async () => {
                const userPromises = inventory.userIds.map(async (userId) => {
                    const { data: userData } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersMicroserviceUrl}/${userId}`));
                    const { password, createdAt, ...cleanUser } = userData;
                    return cleanUser;
                });
                const resolved = await Promise.all(userPromises);
                return resolved.filter(u => u !== null);
            }, async () => {
                console.error(`[BFF Fallback] Retornando usuarios fantasma temporales debido a caída de ms-users`);
                return inventory.userIds.map((userId) => ({
                    id: userId,
                    email: 'usuario.no.disponible@smartlogix.com',
                    role: { id: 0, name: 'OFFLINE_MODE' }
                }));
            });
            return {
                ...inventory,
                users: externalUsers,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || `Error en el orquestador BFF al consolidar el detalle del almacén #${id}`);
        }
    }
    async getAllTypes() {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-GET-TYPES', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/types`));
                return data;
            }, async () => {
                console.error('[BFF Fallback - getTypes] ms-inventory inaccesible. Devolviendo catálogo de emergencia.');
                return [
                    { id: 1, name: 'Inventario A (Supermercado) [MODO OFFLINE]', description: 'Catálogo de contingencia' },
                    { id: 2, name: 'Inventario B (Médico) [MODO OFFLINE]', description: 'Catálogo de contingencia' }
                ];
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al recuperar el catálogo de tipos de inventario');
        }
    }
    async getItemById(itemId) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-GET-ITEM', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/items/${itemId}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException(`El catálogo de inventarios no se encuentra disponible. No se pudo verificar el producto #${itemId}.`);
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || `Error al recuperar el detalle del ítem #${itemId} desde el BFF`);
        }
    }
    async getItems() {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-GET-ITEM', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.inventoryMicroserviceUrl}/items`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException(`El catálogo de inventarios no se encuentra disponible.`);
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || `Error al recuperar listar detalles de los ítems desde el BFF`);
        }
    }
    async createInventory(createInventoryDto, userId) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-CREATE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.inventoryMicroserviceUrl, createInventoryDto, {
                    headers: { 'x-user-id': userId },
                }));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de creación de almacenes no está disponible temporalmente. Intente más tarde.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al crear el almacén de inventario');
        }
    }
    async addItemToInventory(inventoryId, createItemDto) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-ADD-ITEM', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.inventoryMicroserviceUrl}/${inventoryId}/items`, createItemDto));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio encargado de añadir productos al inventario no se encuentra disponible.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al procesar el alta del producto desde el orquestador BFF');
        }
    }
    async createType(createInventoryTypeDto) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-CREATE-TYPE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.inventoryMicroserviceUrl}/types`, createInventoryTypeDto));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio de configuración de tipos de almacén no está disponible.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al procesar el alta de la categoría desde el BFF');
        }
    }
    async updateItemStock(itemId, updateStockDto) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-UPDATE-STOCK', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.inventoryMicroserviceUrl}/items/${itemId}/stock`, updateStockDto));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio de actualización de inventarios no está disponible en este momento. La orden no pudo alterar el stock.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al procesar la actualización de stock en el BFF');
        }
    }
    async deleteInventory(id) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-DELETE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.inventoryMicroserviceUrl}/${id}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de eliminación de almacenes no está respondiendo. Intente más tarde.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            throw new common_1.InternalServerErrorException(error.response?.data?.message || 'Error al eliminar el almacén');
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        circuit_breaker_service_1.CircuitBreakerService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map