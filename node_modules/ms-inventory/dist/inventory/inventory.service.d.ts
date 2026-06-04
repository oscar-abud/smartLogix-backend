import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
export declare class InventoryService {
    private readonly inventoryRepository;
    constructor(inventoryRepository: Repository<Inventory>);
    registerInventory(createInventoryDto: CreateInventoryDto): Promise<Inventory>;
    getAll(): Promise<Inventory[]>;
    getProduct(id: string): Promise<Inventory | null>;
    deleteProduct(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
