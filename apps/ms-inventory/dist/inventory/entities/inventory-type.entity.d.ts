import { InventoryItem } from './inventory-item.entity';
export declare class InventoryType {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    items: InventoryItem[];
}
