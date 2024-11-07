import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DataUserService } from './data_user.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Commissions } from 'src/typeorm/entities/commissions';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { get5TopDto } from './dto/get5Top.dto';
@ApiBearerAuth()
@ApiTags('data-user')
@Controller('data-user')
export class DataUserController {
  constructor(private dataUserService: DataUserService) {}
  @UseGuards(AuthGuard)
  @Get('top-five-table')
  @UseInterceptors(NoFilesInterceptor())
  async top5Table(@Query() query: get5TopDto) {
    try {
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const result = await this.dataUserService.top5Table(
        query.user_code,
        dateRange,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Commissions>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('list-commission-branch')
  @UseInterceptors(NoFilesInterceptor())
  async listCommissionBranch(@Query() query: get5TopDto, @Req() req) {
    try {
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const { user_code } = req.user;
      const result = await this.dataUserService.listCommissionBranch(
        user_code,
        dateRange,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Commissions>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
