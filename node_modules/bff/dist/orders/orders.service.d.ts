import { HttpService } from '@nestjs/axios';
export declare class OrdersService {
    private readonly httpService;
    private readonly ordersUrl;
    constructor(httpService: HttpService);
    redireccionarAMsOrders(datosOrden: any): Promise<any>;
}
