// apps/bff/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para las rutas: http://localhost:3000/api/...
  app.setGlobalPrefix('api');

  // 2. Habilitar CORS para tu Frontend de React
  app.enableCors({
    origin: 'http://localhost:5173', // La URL local de tu React + Vite
    credentials: true,
  });

  // 3. Validaciones globales para los DTOs que envíe el Front
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  console.log('BFF Orquestador listen at http://localhost:3000/api');
}
bootstrap();