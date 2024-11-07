import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from 'src/typeorm/entities/tasks';
import { Assignments } from 'src/typeorm/entities/assignments';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, Assignments, Users])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
