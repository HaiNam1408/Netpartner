import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from 'src/typeorm/entities/education';

@Module({
  imports:[TypeOrmModule.forFeature([Education])],
  controllers: [EducationController],
  providers: [EducationService]
})
export class EducationModule {}
