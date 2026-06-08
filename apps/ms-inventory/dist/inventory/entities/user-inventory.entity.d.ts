import { Inventory } from './inventory.entity';
export declare class UserInventory {
    id: number;
    userId: string;
    inventoryId: number;
    assignedAt: Date;
    inventory: Inventory;
}
