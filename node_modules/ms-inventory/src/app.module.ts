import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';

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
      autoLoadEntities: true,
      synchronize: false,
    }),
    InventoryModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}