import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { HttpModule } from '@nestjs/axios';
import { DocsController } from './docs.controller';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    InventoryModule,
  ],
  controllers: [DocsController],
})
export class AppModule {}
