import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    createOrder(createOrderDto: CreateOrderDto): Promise<any>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<any>;
    remove(id: number): Promise<any>;
}
