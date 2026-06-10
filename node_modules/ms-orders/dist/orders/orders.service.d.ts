import { Repository, DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly dataSource;
    private readonly httpService;
    constructor(orderRepository: Repository<Order>, dataSource: DataSource, httpService: HttpService);
    create(createOrderDto: CreateOrderDto): Promise<{
        message: string;
        orderId: number;
        totalAmount: number;
        status: OrderStatus;
        createdAt: Date;
    }>;
    findAll(): Promise<Order[]>;
}
