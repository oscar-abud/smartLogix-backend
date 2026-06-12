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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
let OrdersService = class OrdersService {
    orderRepository;
    dataSource;
    httpService;
    constructor(orderRepository, dataSource, httpService) {
        this.orderRepository = orderRepository;
        this.dataSource = dataSource;
        this.httpService = httpService;
    }
    async findAll() {
        return await this.orderRepository.find({
            relations: {
                items: true,
            },
            order: {
                createdAt: 'DESC'
            },
        });
    }
    async findOrderById(orderId) {
        try {
            const orden = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: {
                    items: true,
                },
                order: {
                    createdAt: 'DESC'
                },
            });
            if (!orden) {
                throw new common_1.NotFoundException(`El orden con ID ${orderId} no existe en el inventario.`);
            }
            return orden;
        }
        catch (error) {
            console.error('Error en buscar el orden en OrdersService:', error);
            throw new common_1.InternalServerErrorException('No se pudo buscar la orden debido a un problema interno.');
        }
    }
    async create(createOrderDto) {
        const { items } = createOrderDto;
        const inventoryUrl = 'http://localhost:3002/api/inventory';
        let totalAmount = 0;
        const validatedItems = [];
        for (const item of items) {
            const { productId, quantity } = item;
            let productData;
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${inventoryUrl}/items/${productId}`));
                productData = response.data;
            }
            catch (error) {
                throw new common_1.NotFoundException(`El producto con ID ${productId} no existe en el catálogo.`);
            }
            if (productData.stockAvailable < quantity) {
                throw new common_1.BadRequestException(`Stock insuficiente para el artículo '${productData.name}'. Stock actual: ${productData.stockAvailable}, solicitado: ${quantity}`);
            }
            const unitPrice = parseFloat(productData.price);
            const subtotal = unitPrice * quantity;
            totalAmount += subtotal;
            validatedItems.push({
                productId,
                quantity,
                unitPrice,
            });
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = new order_entity_1.Order();
            order.status = order_entity_1.OrderStatus.PENDING;
            order.totalAmount = totalAmount;
            const savedOrder = await queryRunner.manager.save(order);
            for (const validItem of validatedItems) {
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.orderId = savedOrder.id;
                orderItem.productId = validItem.productId;
                orderItem.quantity = validItem.quantity;
                orderItem.price = validItem.unitPrice;
                await queryRunner.manager.save(orderItem);
                await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${inventoryUrl}/items/${validItem.productId}/stock`, {
                    quantity: -validItem.quantity,
                }));
            }
            await queryRunner.commitTransaction();
            return {
                message: 'Orden multi-producto creada con éxito y stock descontado del inventario.',
                orderId: savedOrder.id,
                totalAmount: savedOrder.totalAmount,
                status: savedOrder.status,
                totalItemsProcessed: validatedItems.length,
                createdAt: savedOrder.createdAt,
            };
        }
        catch (transactionError) {
            await queryRunner.rollbackTransaction();
            console.error('Error transaccional en OrdersService:', transactionError);
            throw new common_1.InternalServerErrorException('No se pudo procesar la orden debido a un problema interno de consistencia.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(orderId, updateOrderStatusDto) {
        try {
            const order = await this.orderRepository.findOne({ where: { id: orderId } });
            if (!order) {
                throw new common_1.NotFoundException(`La orden con ID ${orderId} no existe.`);
            }
            order.status = updateOrderStatusDto.status;
            return await this.orderRepository.save(order);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error interno al actualizar el estado de la orden.');
        }
    }
    async remove(orderId) {
        try {
            const order = await this.orderRepository.findOne({ where: { id: orderId } });
            if (!order) {
                throw new common_1.NotFoundException(`La orden con ID ${orderId} no existe.`);
            }
            await this.orderRepository.remove(order);
            return { message: `Orden #${orderId} eliminada correctamente de forma lógica/física.` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error interno al intentar eliminar la orden.');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        axios_1.HttpService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map