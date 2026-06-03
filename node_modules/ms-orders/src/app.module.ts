import { Module } from '@nestjs/common';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
