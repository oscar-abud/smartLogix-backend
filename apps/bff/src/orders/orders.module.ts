import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [HttpModule, AuthModule, CommonModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}