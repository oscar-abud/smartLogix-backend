import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { UserInventory } from './entities/user-inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { InventoryType } from './entities/inventory-type.entity';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryService {
    private readonly inventoryRepository;
    private readonly itemRepository;
    private readonly typeRepository;
    private readonly dataSource;
    constructor(inventoryRepository: Repository<Inventory>, itemRepository: Repository<InventoryItem>, typeRepository: Repository<InventoryType>, dataSource: DataSource);
    registerInventory(createInventoryDto: CreateInventoryDto, creatorUserId: string): Promise<Inventory>;
    addItemToInventory(inventoryId: number, createItemDto: CreateItemDto): Promise<InventoryItem>;
    createInventoryType(createInventoryTypeDto: CreateInventoryTypeDto): Promise<InventoryType>;
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
    getAllInventoryTypes(): Promise<InventoryType[]>;
    getItemById(itemId: number): Promise<InventoryItem>;
    getItems(): Promise<InventoryItem[]>;
    assignUser(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateUserRelation(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateItemStock(itemId: number, updateStockDto: UpdateStockDto): Promise<{
        message: string;
        itemId: number;
        sku: string;
        previousStock: number;
        newStock: number;
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
