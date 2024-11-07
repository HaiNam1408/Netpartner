import { Module } from '@nestjs/common';
import { BranchingService } from './branching.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branching } from 'src/typeorm/entities/branching';
import { BranchingController } from './branching.controller';
import { Users } from 'src/typeorm/entities/users';
import { Branches } from 'src/typeorm/entities/branches';

@Module({
  imports: [TypeOrmModule.forFeature([Branching, Users, Branches])],
  providers: [BranchingService],
  exports: [BranchingService],
  controllers: [BranchingController],
})
export class BranchingModule {}
