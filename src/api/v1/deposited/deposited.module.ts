import { Module } from '@nestjs/common';
import { DepositedService } from './deposited.service';
import { DepositedController } from './deposited.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/users';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Customers } from 'src/typeorm/entities/Customers';
import { DepositedCustomer } from 'src/typeorm/entities/deposited';

@Module({
  imports: [TypeOrmModule.forFeature([Customers, Users, DepositedCustomer])],
  controllers: [DepositedController],
  providers: [DepositedService,GlobalRecusive]
})
export class DepositedModule {}
