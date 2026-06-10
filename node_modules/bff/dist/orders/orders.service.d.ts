import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dto/create-order.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';
export declare class OrdersService {
    private readonly httpService;
    private readonly breakerService;
    private readonly ordersMicroserviceUrl;
    private readonly inventoryMicroserviceUrl;
    constructor(httpService: HttpService, breakerService: CircuitBreakerService);
    getOrdersHistory(): Promise<any>;
    getOrderById(orderId: number): Promise<any>;
    createOrder(createOrderDto: CreateOrderDto): Promise<any>;
    updateOrderStatus(orderId: number, status: string): Promise<any>;
    deleteOrder(orderId: number): Promise<any>;
}
