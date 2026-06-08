import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

import { Inventory } from './entities/inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryType } from './entities/inventory-type.entity';
import { UserInventory } from './entities/user-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryItem, 
      InventoryType, 
      Inventory, 
      UserInventory
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

