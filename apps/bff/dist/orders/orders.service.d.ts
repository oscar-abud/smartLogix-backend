import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dto/create-order.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';
export declare class OrdersService {
    private readonly httpService;
    private readonly breakerService;
    private readonly ordersMicroserviceUrl;
    constructor(httpService: HttpService, breakerService: CircuitBreakerService);
    getOrdersHistory(): Promise<any>;
    createOrder(createOrderDto: CreateOrderDto): Promise<any>;
}
