import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateItemDto } from './dto/create-item.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<{
        items: import("./entities/inventory-item.entity").InventoryItem[];
        totalItems: number;
        totalUsers: number;
        userIds: string[];
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        userAssignments: import("./entities/user-inventory.entity").UserInventory[];
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        items: import("./entities/inventory-item.entity").InventoryItem[];
        totalItems: number;
        totalUsers: number;
        userIds: string[];
    }>;
    create(createInventoryDto: CreateInventoryDto, userId: string): Promise<import("./entities/inventory.entity").Inventory>;
    assignUserToInventory(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addItem(id: number, createItemDto: CreateItemDto): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    updateUserInventoryRelation(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeUserFromInventory(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    delete(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
