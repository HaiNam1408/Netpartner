import { Module } from '@nestjs/common';
import { UserOnlineController } from './user_online.controller';
import { UserOnlineService } from './user_online.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnline } from 'src/typeorm/entities/UserOnline';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports: [TypeOrmModule.forFeature([UserOnline, Users])],
  controllers: [UserOnlineController],
  providers: [UserOnlineService],
})
export class UserOnlineModule {}
