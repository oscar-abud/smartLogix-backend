// apps/bff/src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module'; // 👈 Importamos tu módulo de autenticación

import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
  ],
  controllers: [
    InventoryController
  ],
  providers: [
    InventoryService,
  ],
})
export class AppModule {}