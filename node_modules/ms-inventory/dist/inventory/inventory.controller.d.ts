import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<import("./entities/inventory.entity").Inventory[]>;
    findUser(id: string): Promise<import("./entities/inventory.entity").Inventory | null>;
    createProduct(createInventoryDto: CreateInventoryDto): Promise<import("./entities/inventory.entity").Inventory>;
    deleteProduct(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
