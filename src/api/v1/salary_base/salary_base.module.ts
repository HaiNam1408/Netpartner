import { Module } from '@nestjs/common';
import { SalaryBaseController } from './salary_base.controller';
import { SalaryBaseService } from './salary_base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryBase } from 'src/typeorm/entities/salary_base';

@Module({
  imports:[TypeOrmModule.forFeature([SalaryBase])],
  controllers: [SalaryBaseController],
  providers: [SalaryBaseService]
})
export class SalaryBaseModule {}
