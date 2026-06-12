export declare class ShippingOrderItemDto {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: string;
}
export declare class ShippingOrderDataDto {
    id: number;
    status: string;
    totalAmount: string;
    createdAt: string;
    items: ShippingOrderItemDto[];
}
export declare class FormManualDataDto {
    recipientName: string;
    shippingAddress: string;
    shippingDistrict: string;
    shippingCity: string;
}
export declare class CreateShippingDto {
    order: ShippingOrderDataDto;
    formManualData: FormManualDataDto;
}
