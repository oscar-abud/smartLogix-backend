import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<{
        totalItems: number;
        totalUsers: number;
        userIds: string[];
        id: number;
        name: string;
        description: string;
        createdAt: Date;
        items: import("./entities/inventory-item.entity").InventoryItem[];
        userAssignments: import("./entities/user-inventory.entity").UserInventory[];
    }[]>;
    findOne(id: number): Promise<import("./entities/inventory.entity").Inventory>;
    create(createInventoryDto: CreateInventoryDto, userId: string): Promise<import("./entities/inventory.entity").Inventory>;
    assignUserToInventory(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
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
