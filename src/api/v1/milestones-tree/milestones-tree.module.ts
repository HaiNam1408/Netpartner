import { Module } from '@nestjs/common';
import { MilestonesTreeController } from './milestones-tree.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonesTree } from 'src/typeorm/entities/milestones-tree.entity';
import { MilestonesTreeService } from './milestones-tree.service';


@Module({
  imports: [TypeOrmModule.forFeature([MilestonesTree])],
  controllers: [MilestonesTreeController],
  providers: [MilestonesTreeService]
})
export class MilestonesTreeModule { }
