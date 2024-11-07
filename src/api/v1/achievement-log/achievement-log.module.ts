import { Module } from '@nestjs/common';
import { AchievementLogController } from './achievement-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementLogService } from './achievement-log.service';
import { AchievementLog } from 'src/typeorm/entities/achievement-log.entity';


@Module({
  imports: [TypeOrmModule.forFeature([AchievementLog])],
  controllers: [AchievementLogController],
  providers: [AchievementLogService]
})
export class AchievementLogModule { }
