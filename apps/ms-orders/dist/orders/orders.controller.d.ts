import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findOrderById(id: number): Promise<import("./entities/order.entity").Order>;
    create(createOrderDto: CreateOrderDto): Promise<{
        message: string;
        orderId: number;
        totalAmount: number;
        status: import("./entities/order.entity").OrderStatus;
        quantity: number;
        createdAt: Date;
    }>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./entities/order.entity").Order>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
