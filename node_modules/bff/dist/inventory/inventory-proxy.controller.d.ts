import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
export declare class InventoryProxyController {
    private readonly httpService;
    constructor(httpService: HttpService);
    proxyToInventoryModule(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
