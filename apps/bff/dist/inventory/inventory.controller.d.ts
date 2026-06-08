import { InventoryService } from './inventory.service';
import { AuthService } from '../auth/auth.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    private readonly authService;
    constructor(inventoryService: InventoryService, authService: AuthService);
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    createInventory(createInventoryDto: CreateInventoryDto, req: any): Promise<any>;
    unlinkUserFromInventory(inventoryId: number, userId: string): Promise<any>;
    deleteInventory(id: number): Promise<any>;
}
