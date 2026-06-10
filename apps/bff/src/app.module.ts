// apps/bff/src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';

import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    CommonModule,
    OrdersModule
  ],
  controllers: [
    InventoryController
  ],
  providers: [
    InventoryService,
  ],
})
export class AppModule {}