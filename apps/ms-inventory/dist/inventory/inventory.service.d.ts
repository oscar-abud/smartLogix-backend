import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
export declare class InventoryService {
    private readonly inventoryRepository;
    private readonly dataSource;
    constructor(inventoryRepository: Repository<Inventory>, dataSource: DataSource);
    registerInventory(createInventoryDto: CreateInventoryDto, creatorUserId: string): Promise<Inventory>;
    getAll(): Promise<Inventory[]>;
    getInventory(id: number): Promise<Inventory>;
    deleteInventory(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
