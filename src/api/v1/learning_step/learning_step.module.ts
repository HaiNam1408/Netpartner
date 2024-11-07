import { Module } from '@nestjs/common';
import { LearningStepController } from './learning_step.controller';
import { LearningStepService } from './learning_step.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Users } from 'src/typeorm/entities/users';
import { LearningPath } from 'src/typeorm/entities/learing-path';
import { LearningItem } from 'src/typeorm/entities/learning-item';
import { UserProgressTree } from 'src/typeorm/entities/user-progress';
import { KnowledgeTree } from 'src/typeorm/entities/knowledge-tree';

@Module({
  imports: [TypeOrmModule.forFeature([LearningPath, LearningItem, Users, UserProgressTree, KnowledgeTree])],
  controllers: [LearningStepController],
  providers: [LearningStepService,GlobalRecusive]
})
export class LearningStepModule {}
