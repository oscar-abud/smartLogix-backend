import { InventoryService } from './inventory.service';
import { AuthService } from '../auth/auth.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class InventoryController {
    private readonly inventoryService;
    private readonly authService;
    constructor(inventoryService: InventoryService, authService: AuthService);
    findAll(): Promise<any[]>;
    findAllTypes(): Promise<any>;
    findItemById(itemId: number): Promise<any>;
    findOne(id: number): Promise<any>;
    createInventory(createInventoryDto: CreateInventoryDto, req: any): Promise<any>;
    createType(createInventoryTypeDto: CreateInventoryTypeDto): Promise<any>;
    addItem(id: number, createItemDto: CreateItemDto): Promise<any>;
    updateStock(itemId: number, updateStockDto: UpdateStockDto): Promise<any>;
    unlinkUserFromInventory(inventoryId: number, userId: string): Promise<any>;
    deleteInventory(id: number): Promise<any>;
}
