// apps/bff/src/docs.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@Controller('docs-json')
export class DocsController {
  constructor(private readonly httpService: HttpService) {}

  @Get('users')
  async getUsersDocs() {
    // Descargamos el Swagger nativo de ms-users
    const { data } = await firstValueFrom(
      this.httpService.get('http://localhost:3001/docs-json')
    );
    
    // Le cambiamos el prefijo para que apunte al proxy del BFF
    data.servers = [{ url: '/api/users-proxy' }];
    return data;
  }

  @Get('inventory')
  async getInventoryDocs() {
    // 1. Descargamos el Swagger nativo de ms-inventory
    const { data } = await firstValueFrom(
      this.httpService.get('http://localhost:3002/docs-json')
    );
    
    // Cambiamos el prefijo para que apunte al proxy de inventario
    data.servers = [{ url: '/api/inventory-proxy' }];
    return data;
  }
}