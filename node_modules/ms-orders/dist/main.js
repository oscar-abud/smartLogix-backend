"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SmartLogix - Microservicio de Ordenes')
        .setDescription('API interna para la gestión y validación de usuarios')
        .setVersion('1.0')
        .addTag('Orders')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const puerto = process.env.PORT ?? 3003;
    await app.listen(puerto);
    console.log(`MS-Orders corriendo en: http://localhost:${puerto}/api`);
    console.log(`Documentación Swagger en: http://localhost:${puerto}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map