import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/typeorm/entities/Notifications';
import { BroadCasts } from 'src/typeorm/entities/broadCasts';
import { Department } from 'src/typeorm/entities/department';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications, BroadCasts, Department, Users]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports:[NotificationsService]
})
export class NotificationsModule {}
