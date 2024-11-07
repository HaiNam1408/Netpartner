import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commissions } from 'src/typeorm/entities/commissions';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commissions,
      OrderHistoryCustomer,
      RegisteredCustomer,
      Users
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, GlobalRecusive],
})
export class DashboardModule {}
