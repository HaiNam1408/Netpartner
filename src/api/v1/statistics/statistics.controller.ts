import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Statistics } from 'src/typeorm/entities/statistics';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetStatisticDto } from './dto/getStatistic.dto';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { UpdateInvesmentDto } from './dto/updateInvestment.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { createResponsibility } from './dto/createResponsibility.dto';
import { GetAllResponsibilityUserDto } from './dto/getAllResponsibily.dto';
import { GetStatisticUserDto } from './dto/getStatisticUser.dto';

@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticService: StatisticsService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CEO, Role.ACCOUNTANT)
  @Get('get-satistic-bussinis')
  async getStaticUserBunssinis(
    @Query() { user_code, month, year }: GetStatisticDto,
  ) {
    try {
      const result = await this.statisticService.getStatisticBusiness();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-statistic-business-user')
  async getStatisticBusinessUser(
    @Query() { user_code, startDate, endDate }: GetStatisticUserDto,
  ) {
    try {
      const result = await this.statisticService.getInfoStatistic(
        user_code,
        startDate,
        endDate,
      );
      return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Statistics>(null, HttpStatus.ERROR, error.message);
    }
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CEO, Role.ACCOUNTANT)
  @Post('create-salary')
  async getSalary(@Query() { month, year }: GetStatisticDto) {
    try {
      const result = await this.statisticService.calculateSalaries();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CEO, Role.ACCOUNTANT)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('review-room-invesment')
  async ReviewRoomInvestment(
    @Body() { userId, profitIndex, signalIndex }: UpdateInvesmentDto,
  ) {
    try {
      await this.statisticService.updateIndexInvestment(
        userId,
        profitIndex,
        signalIndex,
      );
      return new ResponseData<any>(
        'Đánh giá thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-responsibility')
  async createResponsibility(@Body() body: createResponsibility, @Req() req) {
    try {
      const { id } = req.user;
      await this.statisticService.createResponsibility(body, id);
      return new ResponseData<any>(
        'Đánh giá thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-responsibility')
  async getResponsibilityId(@Query('id') id: number) {
    try {
      const result = await this.statisticService.getResponsibilityId(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-responsibility/:id')
  async getResponsibilityById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.statisticService.getResponsibilityById(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @Get('get-attendance')
  async abc(){
    try {
      const result = await this.statisticService.attendance_index();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Get('get-all-responsibility')
  async getAllResponsibility(@Req() req) {
    try {
      const {id} = req.user;
      const result = await this.statisticService.getAllResponsibilityUser(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Statistics>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
