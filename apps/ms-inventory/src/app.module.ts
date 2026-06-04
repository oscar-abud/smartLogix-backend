import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/entities/inventory.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER || 'inventory_user',
      password: process.env.DB_PASSWORD || 'inventory_password',
      database: process.env.DB_NAME || 'smartlogix_inventory',
      entities: [Inventory],
      synchronize: true,
    }),
    InventoryModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}