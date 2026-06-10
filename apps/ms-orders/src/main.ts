import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('SmartLogix - Microservicio de Ordenes')
    .setDescription('API interna para la gestión y validación de usuarios')
    .setVersion('1.0')
    .addTag('Orders')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // (http://localhost:3003/docs)
  SwaggerModule.setup('docs', app, document);

  const puerto = process.env.PORT ?? 3003;
  await app.listen(puerto);
  console.log(`MS-Orders corriendo en: http://localhost:${puerto}/api`);
  console.log(`Documentación Swagger en: http://localhost:${puerto}/docs`);
}
bootstrap();
