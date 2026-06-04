// apps/bff/src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InventoryProxyController } from './inventory-proxy.controller'; 

@Module({
  imports: [HttpModule],
  controllers: [InventoryProxyController],
})
export class InventoryModule {}