import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { UserInventory } from './entities/user-inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateItemDto } from './dto/create-item.dto';
export declare class InventoryService {
    private readonly inventoryRepository;
    private readonly itemRepository;
    private readonly dataSource;
    constructor(inventoryRepository: Repository<Inventory>, itemRepository: Repository<InventoryItem>, dataSource: DataSource);
    registerInventory(createInventoryDto: CreateInventoryDto, creatorUserId: string): Promise<Inventory>;
    addItemToInventory(inventoryId: number, createItemDto: CreateItemDto): Promise<InventoryItem>;
    getAll(): Promise<{
        items: InventoryItem[];
        totalItems: number;
        totalUsers: number;
        userIds: string[];
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        userAssignments: UserInventory[];
    }[]>;
    getInventory(id: number): Promise<{
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        items: InventoryItem[];
        totalItems: number;
        totalUsers: number;
        userIds: string[];
    }>;
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
