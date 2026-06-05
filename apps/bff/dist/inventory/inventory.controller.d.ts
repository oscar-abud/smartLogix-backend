import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    createProduct(createInventoryDto: CreateInventoryDto): Promise<any>;
    deleteProduct(id: string): Promise<any>;
}
