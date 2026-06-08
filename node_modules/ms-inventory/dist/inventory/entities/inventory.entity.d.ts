import { InventoryItem } from './inventory-item.entity';
import { UserInventory } from './user-inventory.entity';
export declare class Inventory {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    items: InventoryItem[];
    userAssignments: UserInventory[];
}
