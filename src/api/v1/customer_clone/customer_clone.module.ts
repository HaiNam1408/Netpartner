import { Module } from '@nestjs/common';
import { CustomerCloneController } from './customer_clone.controller';
import { CustomerCloneService } from './customer_clone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerClone } from 'src/typeorm/entities/customer_clone.entity';
import { Customers } from 'src/typeorm/entities/Customers';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports:[TypeOrmModule.forFeature([CustomerClone, Customers, NotificationsModule])],
  controllers: [CustomerCloneController],
  providers: [CustomerCloneService]
})
export class CustomerCloneModule {}
