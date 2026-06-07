import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // El puerto exacto donde corre tu React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Permite el envío de tokens y cookies si fuese necesario
  });
  app.setGlobalPrefix('api');

  // Swagger lee de forma nativa tus controladores manuales del BFF
  const config = new DocumentBuilder()
    .setTitle('SmartLogix BFF Gateway')
    .setDescription('Documentación unificada y centralizada del Gateway')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Ya no necesitas pasares 'urls' dinámicas ni explorers rústicos

  await app.listen(3000);
  console.log('BFF unificado corriendo de forma manual y segura');
  console.log('Swagger centralizado disponible en http://localhost:3000/docs');
}
bootstrap();