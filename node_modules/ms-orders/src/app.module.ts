import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434', 10),
      username: process.env.DB_USER || 'orders_user',
      password: process.env.DB_PASSWORD || 'orders_password',
      database: process.env.DB_NAME || 'smartlogix_orders',
      autoLoadEntities: true,
      synchronize: false,
    }),
    OrdersModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}