import { Module } from '@nestjs/common';
import { AttendanceCodeController } from './attendance-code.controller';
import { AttendanceCodeService } from './attendance-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance_code } from 'src/typeorm/entities/Attendances';
import { Users } from 'src/typeorm/entities/users';
import { Attendance_info } from 'src/typeorm/entities/attendancesInfo';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance_code, Users, Attendance_info])],
  controllers: [AttendanceCodeController],
  providers: [AttendanceCodeService],
})
export class AttendanceCodeModule {}
