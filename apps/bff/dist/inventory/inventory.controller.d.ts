import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    createInventory(createInventoryDto: CreateInventoryDto, req: any): Promise<any>;
    deleteInventory(id: number): Promise<any>;
}
