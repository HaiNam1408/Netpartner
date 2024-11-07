import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from 'src/typeorm/entities/Customers';
import { UserProcessAchievementTree } from 'src/typeorm/entities/user-process-achievement-tree.entity';
import { UserProcessAchievementTreeController } from './user-process-achievement-tree.controller';
import { UserProcessAchievementTreeService } from './user-process-achievement-tree.service';
import { Users } from 'src/typeorm/entities/users';
import { AchievementTree } from '../../../typeorm/entities/achievement-tree.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UserProcessAchievementTree, Customers, Users, AchievementTree])],
  controllers: [UserProcessAchievementTreeController],
  providers: [UserProcessAchievementTreeService]
})
export class UserProcessAchievementTreeModule { }
