import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [AuthModule, InventoryModule]
})
export class AppModule {}
