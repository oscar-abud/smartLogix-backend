// apps/bff/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configuración limpia usando el explorador nativo de NestJS
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/api/docs-json/users',
          name: 'Módulo de Usuarios (ms-users)',
        },
        {
          url: '/api/docs-json/inventory',
          name: 'Módulo de Inventario (ms-inventory)',
        },
      ],
    },
  };

  const baseDocument = {
    openapi: '3.0.0',
    info: {
      title: 'SmartLogix BFF Gateway',
      version: '1.0.0',
    },
    paths: {},
  };

  // Pasamos las opciones con explorer habilitado
  SwaggerModule.setup('docs', app, baseDocument as any, swaggerOptions);

  await app.listen(3000);
  console.log('BFF unificado corriendo');
  console.log('Swagger centralizado en http://localhost:3000/docs');
}
bootstrap();