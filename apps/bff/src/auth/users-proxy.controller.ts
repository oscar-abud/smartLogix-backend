import { Controller, All, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';

@Controller('users-proxy') // URL base: http://localhost:3000/api/users-proxy
export class UsersProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('*') // Captura cualquier sub-ruta (ej: /profile, /update-password) y cualquier método
  @UseGuards(AuthGuard('jwt')) // Blindaje: Nadie pasa al microservicio sin un token válido
  async proxyToUsersModule(@Req() req: Request, @Res() res: Response) {
    
    // 1. Extraemos la ruta exacta después de 'users-proxy/'
    const subRoute = req.params[0]; 
    
    // 2. Apuntamos al endpoint real de tu ms-users (puerto 3001)
    const targetUrl = `http://localhost:3001/api/users/${subRoute}`;

    try {
      // 3. Reenviamos la petición clonando todos los datos que envió React
      const response = await this.httpService.axiosRef({
        method: req.method,
        url: targetUrl,
        data: req.body,    // El body (JSON) pasa directo
        params: req.query, // Los query params (?search=oscar) pasan directo
        headers: {
          // Inyectamos de forma segura los datos del usuario ya descifrados del JWT
          // Así el ms-users sabe exactamente quién está operando sin volver a validar el token
          'x-user-id': (req as any).user?.id,
          'x-user-role': (req as any).user?.role,
        },
      });

      // 4. Respondemos al Frontend exactamente lo que nos diga el microservicio
      return res.status(response.status).json(response.data);
      
    } catch (error: any) {
      // Si el microservicio falla o sus DTOs rechazan los datos, atrapamos el error y lo devolvemos limpio
      return res
        .status(error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response?.data || { message: 'Error de comunicación con el microservicio de usuarios' });
    }
  }
}