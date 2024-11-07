import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from 'src/typeorm/entities/salary';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Affiliate } from 'src/typeorm/entities/Affiliate';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salary, SalaryBase, Commissions, Affiliate]),
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
