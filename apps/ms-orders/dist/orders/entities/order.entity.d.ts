import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSED = "PROCESSED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: number;
    status: OrderStatus;
    totalAmount: number;
    createdAt: Date;
    items: OrderItem[];
}
