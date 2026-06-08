import { HttpService } from '@nestjs/axios';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryService {
    private readonly httpService;
    private readonly inventoryMicroserviceUrl;
    private readonly usersMicroserviceUrl;
    constructor(httpService: HttpService);
    getAll(): Promise<any[]>;
    getInventory(id: number): Promise<any>;
    createInventory(createInventoryDto: CreateInventoryDto, userId: string): Promise<any>;
    deleteInventory(id: number): Promise<any>;
}
