import { Module } from '@nestjs/common';
import { AchievementTreeController } from './achievement-tree.controller';
import { AchievementTreeService } from './achievement-tree.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementTree } from 'src/typeorm/entities/achievement-tree.entity';
import { MilestonesTree } from 'src/typeorm/entities/milestones-tree.entity';
import { UserProcessAchievementTree } from 'src/typeorm/entities/user-process-achievement-tree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementTree, MilestonesTree, UserProcessAchievementTree])],
  controllers: [AchievementTreeController],
  providers: [AchievementTreeService]
})
export class AchievementTreeModule { }
