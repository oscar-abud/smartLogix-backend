import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
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
    getTypes(): Promise<import("./entities/inventory-type.entity").InventoryType[]>;
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
    createType(createInventoryTypeDto: CreateInventoryTypeDto): Promise<import("./entities/inventory-type.entity").InventoryType>;
    assignUserToInventory(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addItem(id: number, createItemDto: CreateItemDto): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    updateUserInventoryRelation(inventoryId: number, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStock(itemId: number, updateStockDto: UpdateStockDto): Promise<{
        message: string;
        itemId: number;
        sku: string;
        previousStock: number;
        newStock: number;
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
