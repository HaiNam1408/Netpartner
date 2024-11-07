import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from 'src/typeorm/entities/question';
import { ResponsibilityIndex } from 'src/typeorm/entities/Responsibility_Index';

@Module({
  imports:[TypeOrmModule.forFeature([Questions,ResponsibilityIndex])],
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
