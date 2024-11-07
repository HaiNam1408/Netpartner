import { Module } from '@nestjs/common';
import { DataUserController } from './data_user.controller';
import { DataUserService } from './data_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from 'src/typeorm/entities/Customers';
import { Commissions } from 'src/typeorm/entities/commissions';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Users } from 'src/typeorm/entities/users';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';

@Module({
  imports:[TypeOrmModule.forFeature([Customers, Commissions, OrderHistoryCustomer, Users])],
  controllers: [DataUserController],
  providers: [DataUserService,GlobalRecusive]
})
export class DataUserModule {}
