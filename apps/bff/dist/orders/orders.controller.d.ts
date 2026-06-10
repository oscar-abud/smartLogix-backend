import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    createOrder(createOrderDto: CreateOrderDto): Promise<any>;
}
