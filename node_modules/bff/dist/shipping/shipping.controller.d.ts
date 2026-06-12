import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    create(createShippingDto: CreateShippingDto): Promise<any>;
    findAll(): Promise<any>;
    findByOrderId(orderId: number): Promise<any>;
    updateStatus(orderId: number, updateShippingStatusDto: UpdateShippingStatusDto): Promise<any>;
    remove(id: string): Promise<any>;
}
