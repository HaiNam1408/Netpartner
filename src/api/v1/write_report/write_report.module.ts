import { Module } from '@nestjs/common';
import { WriteReportController } from './write_report.controller';
import { WriteReportService } from './write_report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { writeReport } from 'src/typeorm/entities/write_report';
import { Users } from 'src/typeorm/entities/users';
import { GlobalRecusive } from 'src/global/globalRecusive';

@Module({
  imports:[TypeOrmModule.forFeature([writeReport,Users])],
  controllers: [WriteReportController],
  providers: [WriteReportService, GlobalRecusive]
})
export class WriteReportModule {}
