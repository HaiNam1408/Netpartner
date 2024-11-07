import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from 'src/typeorm/entities/Customers';
import { Users } from 'src/typeorm/entities/users';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { MailerService } from 'src/mailer/mailer.service';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';


@Module({
  imports:[TypeOrmModule.forFeature([Customers,Users,Affiliate, RegisteredCustomer])],
  controllers: [CustomersController],
  providers: [CustomersService,GlobalRecusive,MailerService]
})
export class CustomersModule {}
