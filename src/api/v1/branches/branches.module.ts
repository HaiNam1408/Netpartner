import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branches } from 'src/typeorm/entities/branches';
import { Users } from 'src/typeorm/entities/users';
import { Branching } from 'src/typeorm/entities/branching';
import { Commissions } from 'src/typeorm/entities/commissions';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Customers } from 'src/typeorm/entities/Customers';

@Module({
  imports: [TypeOrmModule.forFeature([Branches, Users, Branching, Commissions, Customers])],
  controllers: [BranchesController],
  providers: [BranchesService, GlobalRecusive],
})
export class BranchesModule {}
