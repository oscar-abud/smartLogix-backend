import { HttpService } from '@nestjs/axios';
export declare class DocsController {
    private readonly httpService;
    constructor(httpService: HttpService);
    getUsersDocs(): Promise<any>;
    getInventoryDocs(): Promise<any>;
}
