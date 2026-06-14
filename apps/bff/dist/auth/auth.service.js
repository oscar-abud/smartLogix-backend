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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const circuit_breaker_service_1 = require("../common/circuit-breaker.service");
let AuthService = class AuthService {
    jwtService;
    httpService;
    breakerService;
    usersServiceUrl = 'http://localhost:3001/api/users';
    inventoryServiceUrl = 'http://localhost:3002/api/inventory';
    constructor(jwtService, httpService, breakerService) {
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.breakerService = breakerService;
    }
    async login(loginDto) {
        try {
            const usuarioValido = await this.breakerService.runWithCircuitBreaker('MS-USERS-LOGIN', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.usersServiceUrl}/login`, loginDto));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El servicio de autenticación no se encuentra disponible temporalmente.');
            });
            const payload = {
                email: usuarioValido.email,
                sub: usuarioValido.id,
                id_role: usuarioValido.role.id,
                role: usuarioValido.role.name
            };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: usuarioValido.id,
                    email: usuarioValido.email,
                    role: {
                        id: usuarioValido.role.id,
                        name: usuarioValido.role.name,
                    },
                    createdAt: usuarioValido.createdAt,
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.UNAUTHORIZED;
            const message = error.response?.data?.message || 'Credenciales incorrectas o usuario no encontrado';
            throw new common_1.HttpException(message, status);
        }
    }
    async register(registerDto) {
        const { inventoryId, ...userData } = registerDto;
        try {
            const createdUser = await this.breakerService.runWithCircuitBreaker('MS-USERS-REGISTER', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.usersServiceUrl}/register`, userData));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de registro no está disponible temporalmente.');
            });
            if (inventoryId && createdUser?.id) {
                try {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
                        headers: { 'x-user-id': createdUser.id },
                    }));
                }
                catch (invError) {
                    console.error(`[BFF Orquestador] Usuario creado (${createdUser.id}) pero falló vinculación física en almacén ${inventoryId}:`, invError.message);
                }
            }
            return {
                ...createdUser,
                inventoryId: inventoryId ? Number(inventoryId) : null
            };
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.BAD_REQUEST;
            const message = error.response?.data?.message || 'Error al registrar el usuario en el sistema';
            throw new common_1.HttpException(message, status);
        }
    }
    async getAll() {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-USERS-GET-ALL', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersServiceUrl}`));
                return data;
            }, async () => {
                console.error('[BFF Fallback] ms-users inaccesible al listar todos. Enviando array vacío.');
                return [];
            });
        }
        catch (error) {
            const status = error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || 'Error al buscar usuarios';
            throw new common_1.HttpException(message, status);
        }
    }
    async getUser(id) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-USERS-GET-ONE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersServiceUrl}/${id}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('No se puede recuperar la información del perfil en este momento.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.NOT_FOUND;
            const message = error.response?.data?.message || 'Error al buscar un usuario';
            throw new common_1.HttpException(message, status);
        }
    }
    async updateUser(id, updateUserDto) {
        const { inventoryId, ...userData } = updateUserDto;
        try {
            const updatedUser = await this.breakerService.runWithCircuitBreaker('MS-USERS-UPDATE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.usersServiceUrl}/${id}`, userData));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de actualización de perfiles está fuera de línea.');
            });
            if (inventoryId) {
                try {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.inventoryServiceUrl}/${inventoryId}/users`, {}, {
                        headers: { 'x-user-id': id },
                    }));
                }
                catch (invError) {
                    console.error(`[BFF Orquestador] Error editando asignación de almacén para usuario ${id}:`, invError.message);
                }
            }
            return {
                ...updatedUser,
                inventoryId: inventoryId ? Number(inventoryId) : null
            };
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.BAD_REQUEST;
            const message = error.response?.data?.message || 'Error al actualizar el usuario';
            throw new common_1.HttpException(message, status);
        }
    }
    async deleteUser(id) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-USERS-DELETE', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.usersServiceUrl}/${id}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('No se pudo procesar la eliminación del usuario debido a una falla del servidor.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.BAD_REQUEST;
            const message = error.response?.data?.message || 'Error al eliminar un usuario';
            throw new common_1.HttpException(message, status);
        }
    }
    async unlinkUserFromInventory(inventoryId, userId) {
        try {
            return await this.breakerService.runWithCircuitBreaker('MS-INVENTORY-UNLINK', async () => {
                const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.inventoryServiceUrl}/${inventoryId}/users/${userId}`));
                return data;
            }, async () => {
                throw new common_1.ServiceUnavailableException('El sistema de inventarios no responde. No se pudo desvincular al operador.');
            });
        }
        catch (error) {
            if (error instanceof common_1.ServiceUnavailableException)
                throw error;
            const status = error.response?.status || common_1.HttpStatus.BAD_REQUEST;
            const message = error.response?.data?.message || 'Error al desvincular al usuario del almacén';
            throw new common_1.HttpException(message, status);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        axios_1.HttpService,
        circuit_breaker_service_1.CircuitBreakerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map