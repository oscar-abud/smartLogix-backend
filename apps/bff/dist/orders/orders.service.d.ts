import { HttpService } from '@nestjs/axios';
export declare class OrdersService {
    private readonly httpService;
    private readonly inventoryUrl;
    private readonly ordersUrl;
    constructor(httpService: HttpService);
    crearOrdenOrquestada(datosOrden: any): Promise<any>;
}
