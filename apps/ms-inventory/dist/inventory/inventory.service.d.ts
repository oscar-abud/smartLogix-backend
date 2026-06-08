import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { UserInventory } from './entities/user-inventory.entity';
export declare class InventoryService {
    private readonly inventoryRepository;
    private readonly dataSource;
    constructor(inventoryRepository: Repository<Inventory>, dataSource: DataSource);
    registerInventory(createInventoryDto: CreateInventoryDto, creatorUserId: string): Promise<Inventory>;
    getAll(): Promise<{
        totalItems: number;
        totalUsers: number;
        userIds: string[];
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        items: import("./entities/inventory-item.entity").InventoryItem[];
        userAssignments: UserInventory[];
    }[]>;
    getInventory(id: number): Promise<Inventory>;
    assignUser(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateUserRelation(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeUserRelation(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteInventory(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
