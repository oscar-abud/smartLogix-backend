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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersProxyController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const passport_1 = require("@nestjs/passport");
let UsersProxyController = class UsersProxyController {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async proxyToUsersModule(req, res) {
        const subRoute = req.params[0];
        const targetUrl = `http://localhost:3001/api/users/${subRoute}`;
        try {
            const response = await this.httpService.axiosRef({
                method: req.method,
                url: targetUrl,
                data: req.body,
                params: req.query,
                headers: {
                    'x-user-id': req.user?.id,
                    'x-user-role': req.user?.role,
                },
            });
            return res.status(response.status).json(response.data);
        }
        catch (error) {
            return res
                .status(error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json(error.response?.data || { message: 'Error de comunicación con el microservicio de usuarios' });
        }
    }
};
exports.UsersProxyController = UsersProxyController;
__decorate([
    (0, common_1.All)('*'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersProxyController.prototype, "proxyToUsersModule", null);
exports.UsersProxyController = UsersProxyController = __decorate([
    (0, common_1.Controller)('users-proxy'),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UsersProxyController);
//# sourceMappingURL=users-proxy.controller.js.map