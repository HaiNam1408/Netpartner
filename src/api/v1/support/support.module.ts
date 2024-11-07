import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support } from 'src/typeorm/entities/support';
import { Users } from 'src/typeorm/entities/users';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Support, Users]),NotificationsModule],
  controllers: [SupportController],
  providers: [SupportService, GlobalRecusive],
})
export class SupportModule {}
