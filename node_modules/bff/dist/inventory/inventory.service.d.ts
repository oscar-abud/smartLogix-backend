import { HttpService } from '@nestjs/axios';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CircuitBreakerService } from '../common/circuit-breaker.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryService {
    private readonly httpService;
    private readonly breakerService;
    private readonly inventoryMicroserviceUrl;
    private readonly usersMicroserviceUrl;
    constructor(httpService: HttpService, breakerService: CircuitBreakerService);
    getAll(): Promise<any[]>;
    getInventory(id: number): Promise<any>;
    getAllTypes(): Promise<any>;
    createInventory(createInventoryDto: CreateInventoryDto, userId: string): Promise<any>;
    addItemToInventory(inventoryId: number, createItemDto: CreateItemDto): Promise<any>;
    createType(createInventoryTypeDto: CreateInventoryTypeDto): Promise<any>;
    updateItemStock(itemId: number, updateStockDto: UpdateStockDto): Promise<any>;
    deleteInventory(id: number): Promise<any>;
}
