import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendanceCodeService } from './attendance-code.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateAttendanceCodeDto } from './dto/createAttendance.dto';
import { ResponseData } from 'src/global/globalClass';
import { Attendance_code } from 'src/typeorm/entities/Attendances';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAttendenceQueryDto } from './dto/getAttendence.dto';

@ApiBearerAuth()
@ApiTags('attendance-code')
@Controller('attendance-code')
export class AttendanceCodeController {
  constructor(private attendanceService: AttendanceCodeService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-attendance-code')
  async createAffiliate(@Body() body: any) {
    try {
      const result = await this.attendanceService.createAttendance(body);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Attendance_code>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-number-attendance-user')
  async getAllAttendaceCode() {
    try {
      const result = await this.attendanceService.getAttendanceGroupedByCode();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Attendance_code>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-attendance-user')
  async getAttendaceUser(@Query() query: GetAttendenceQueryDto) {
    try {
      const result = await this.attendanceService.getAttendance(
        query.userId,
        query.start_at,
        query.end_at,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Attendance_code>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
