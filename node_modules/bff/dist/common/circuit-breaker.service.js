"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CircuitBreakerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerService = void 0;
const common_1 = require("@nestjs/common");
const opossum_1 = __importDefault(require("opossum"));
let CircuitBreakerService = CircuitBreakerService_1 = class CircuitBreakerService {
    logger = new common_1.Logger(CircuitBreakerService_1.name);
    async runWithCircuitBreaker(serviceName, action, fallbackAction) {
        const options = {
            timeout: 3000,
            errorThresholdPercentage: 50,
            resetTimeout: 10000,
            volumeThreshold: 5,
        };
        const breaker = new opossum_1.default(action, options);
        breaker.fallback(fallbackAction);
        breaker.on('open', () => this.logger.warn(`[CIRCUIT BREAKER OPEN] El microservicio [${serviceName}] está caído o inestable. Desviando tráfico a Fallback.`));
        breaker.on('close', () => this.logger.log(`[CIRCUIT BREAKER CLOSED] El microservicio [${serviceName}] se ha recuperado con éxito.`));
        breaker.on('halfOpen', () => this.logger.log(`[CIRCUIT BREAKER HALF-OPEN] Probando salud del microservicio [${serviceName}]...`));
        try {
            return await breaker.fire();
        }
        catch (error) {
            this.logger.error(`Error procesado por el Breaker de ${serviceName}: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Servicio temporalmente no disponible.`);
        }
    }
};
exports.CircuitBreakerService = CircuitBreakerService;
exports.CircuitBreakerService = CircuitBreakerService = CircuitBreakerService_1 = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerService);
//# sourceMappingURL=circuit-breaker.service.js.map