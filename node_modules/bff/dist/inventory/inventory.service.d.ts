import { HttpService } from '@nestjs/axios';
export declare class InventoryService {
    private readonly httpService;
    private readonly inventoryMicroserviceUrl;
    constructor(httpService: HttpService);
    getAll(): Promise<any>;
    getProduct(id: string): Promise<any>;
    createProduct(createInventoryDto: any): Promise<any>;
    deleteProduct(id: string): Promise<any>;
}
