import { Module } from '@nestjs/common';
import { RegisterCustomerController } from './register_customer.controller';
import { RegisterCustomerService } from './register_customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Users } from 'src/typeorm/entities/users';
import { Customers } from 'src/typeorm/entities/Customers';
import { Affiliate } from 'src/typeorm/entities/Affiliate';

@Module({
  imports: [TypeOrmModule.forFeature([RegisteredCustomer, Users, Customers, Affiliate])],
  controllers: [RegisterCustomerController],
  providers: [RegisterCustomerService,GlobalRecusive]
})
export class RegisterCustomerModule {}
