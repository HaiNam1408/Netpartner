import { Module } from '@nestjs/common';
import { orderHistoryController } from './order_history.controller';
import { OrderHistoryService } from './order_history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';
import { Users } from 'src/typeorm/entities/users';
import { GlobalRecusive } from 'src/global/globalRecusive';

@Module({
  imports:[TypeOrmModule.forFeature([OrderHistoryCustomer,Users])],
  controllers: [orderHistoryController],
  providers: [OrderHistoryService,GlobalRecusive]
})
export class OrderHistoryModule {}
