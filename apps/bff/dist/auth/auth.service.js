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
let AuthService = class AuthService {
    jwtService;
    httpService;
    usersServiceUrl = 'http://localhost:3001/api/users';
    constructor(jwtService, httpService) {
        this.jwtService = jwtService;
        this.httpService = httpService;
    }
    async login(loginDto) {
        try {
            const { data: usuarioValido } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.usersServiceUrl}/login`, loginDto));
            const payload = {
                email: usuarioValido.email,
                sub: usuarioValido.id,
                role: usuarioValido.role
            };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    email: usuarioValido.email,
                    role: usuarioValido.role
                }
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas o usuario no encontrado');
        }
    }
    async register(registerDto) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.usersServiceUrl}/register`, registerDto));
            return data;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.response?.data?.message || 'Error al registrar el usuario en el sistema');
        }
    }
    async getAll() {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersServiceUrl}`));
            return data;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.response?.data?.message || 'Error al buscar usuarios');
        }
    }
    async getUser(id) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.usersServiceUrl}/${id}`));
            return data;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.response?.data?.message || 'Error al buscar un usuario');
        }
    }
    async deleteUser(id) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.usersServiceUrl}/${id}`));
            return data;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.response?.data?.message || 'Error al eliminar un usuario');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map