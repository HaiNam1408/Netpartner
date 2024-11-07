import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from 'src/typeorm/entities/statistics';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Attendance_code } from 'src/typeorm/entities/Attendances';
import { Users } from 'src/typeorm/entities/users';
import { ResponsibilityIndex } from 'src/typeorm/entities/Responsibility_Index';
import { Video } from 'src/typeorm/entities/videoYtb';
import { UserProgress } from 'src/typeorm/entities/userProgress';
import { Salary } from 'src/typeorm/entities/salary';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { Customers } from 'src/typeorm/entities/Customers';

@Module({
  imports:[TypeOrmModule.forFeature(
    [
      Statistics,
      Commissions,
      Attendance_code,
      Users,
      ResponsibilityIndex,
      Video,
      UserProgress,
      Salary,
      SalaryBase,
      Customers
    ])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports:[StatisticsService]
})
export class StatisticsModule {}
