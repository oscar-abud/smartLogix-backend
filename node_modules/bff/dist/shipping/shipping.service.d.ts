import { HttpService } from '@nestjs/axios';
export declare class ShippingService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private readonly microserviceUrl;
    getAllShippings(): Promise<any>;
    getByOrderId(orderId: number): Promise<any>;
    createShipping(payload: {
        order: any;
        formManualData: any;
    }): Promise<any>;
    updateShippingStatus(orderId: number, status: string): Promise<any>;
    deleteShipping(id: string): Promise<any>;
}
