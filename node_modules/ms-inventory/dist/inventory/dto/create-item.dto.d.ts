export declare class CreateItemDto {
    sku: string;
    name: string;
    price: number;
    stockAvailable: number;
    stockReserved?: number;
    inventoryTypeId: number;
}
