import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WriteReportService } from './write_report.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateWriteReportDto } from './dto/createWriteReport.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { writeReport } from 'src/typeorm/entities/write_report';
import { GetAllWriteReportDto } from './dto/getWriteReport.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('write-report')
@Controller('write-report')
export class WriteReportController {
  constructor(private writeReportService: WriteReportService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-write-report')
  async createTicket(@Body() body: CreateWriteReportDto, @Req() req) {
    try {
      const { id } = req.user;
      await this.writeReportService.createWriteReport(body, id);
      return new ResponseData<String>(
        'Tạo report thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<writeReport>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-all-write-report')
  async getAll(@Query() { limit, page }: GetAllWriteReportDto, @Req() req) {
    try {
      const { user_code } = req.user;
      const result = await this.writeReportService.getAllReport(
        user_code,
        limit,
        page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<writeReport>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-write-report/:id')
  async getReportID(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.writeReportService.getReportId(id);
      return new ResponseData<writeReport>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<writeReport>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-report-user')
  async getReportUser(@Query('userId') userId: number) {
    try {
      const result = await this.writeReportService.getReportUser(userId);
      return new ResponseData<writeReport>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<writeReport>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
