import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('SmartLogix - Microservicio de Inventario')
    .setDescription('API interna para la gestión y validación de usuarios')
    .setVersion('1.0')
    .addTag('Inventory')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // (http://localhost:3002/docs)
  SwaggerModule.setup('docs', app, document);

  const puerto = process.env.PORT ?? 3002;
  await app.listen(puerto);
  console.log(`MS-Inventory corriendo en: http://localhost:${puerto}/api`);
  console.log(`Documentación Swagger en: http://localhost:${puerto}/docs`);
}

bootstrap();