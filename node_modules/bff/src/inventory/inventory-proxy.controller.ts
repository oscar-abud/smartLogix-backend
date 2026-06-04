// apps/bff/src/auth/inventory-proxy.controller.ts
import { Controller, All, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('inventory-proxy') // URL base: http://localhost:3000/api/inventory-proxy
export class InventoryProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('*')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Pasamanos automático de Inventario', 
    description: 'Rutas disponibles en ms-inventory:\n\n' +
                 '• **GET /** - Listar todos los productos\n' +
                 '• **GET /:id** - Obtener un producto por ID\n' +
                 '• **POST /** - Crear un producto\n' +
                 '• **DELETE /:id** - Eliminar un producto'
  }) // Protegemos el inventario para que solo usuarios logueados operen
  async proxyToInventoryModule(@Req() req: Request, @Res() res: Response) {
    const subRoute = req.params[0] && req.params[0] !== '/' ? req.params[0] : '';
    
    // Apuntamos al puerto 3002 de ms-inventory
    const targetUrl = `http://localhost:3002/api/inventory/${subRoute}`;

    try {
      const response = await this.httpService.axiosRef({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: {
          'x-user-id': (req as any).user?.id,
          'x-user-role': (req as any).user?.role,
        },
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      return res
        .status(error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response?.data || { message: 'Error de comunicación con el microservicio de inventario' });
    }
  }
}