import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
export declare class UsersProxyController {
    private readonly httpService;
    constructor(httpService: HttpService);
    proxyToUsersModule(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
