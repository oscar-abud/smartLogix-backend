import { InventoryType } from './inventory-type.entity';
import { Inventory } from './inventory.entity';
export declare class InventoryItem {
    id: number;
    sku: string;
    name: string;
    price: number;
    stockAvailable: number;
    stockReserved: number;
    inventoryTypeId: number;
    inventoryId: number;
    createdAt: Date;
    inventoryType: InventoryType;
    inventory: Inventory;
}
