export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSED = "PROCESSED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
