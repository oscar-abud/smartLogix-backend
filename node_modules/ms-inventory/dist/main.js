"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SmartLogix - Microservicio de Inventario')
        .setDescription('API interna para la gestión y validación de usuarios')
        .setVersion('1.0')
        .addTag('Inventory')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const puerto = process.env.PORT ?? 3002;
    await app.listen(puerto);
    console.log(`MS-Inventory corriendo en: http://localhost:${puerto}/api`);
    console.log(`Documentación Swagger en: http://localhost:${puerto}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map