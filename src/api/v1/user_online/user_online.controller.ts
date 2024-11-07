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
import { UserOnlineService } from './user_online.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserOnlineDto } from './dto/createUserOnline.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UserOnline } from 'src/typeorm/entities/UserOnline';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetChartOnlineUserDto } from './dto/getChartUserOnline.dto';

@ApiBearerAuth()
@ApiTags('user-online')
@Controller('user-online')
export class UserOnlineController {
  constructor(private readonly userOnlineService: UserOnlineService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-user-online')
  async createTicket(@Body() body: UserOnlineDto) {
    try {
      const { userId, time } = body;
      await this.userOnlineService.createUserOnline(userId, time);
      return new ResponseData<String>(
        'Tạo user online thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserOnline>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('chart-online-user')
  async getAllOnlineOfUserForYear(@Req() req, @Query() { startDate, endDate }: GetChartOnlineUserDto) {
    try {
      const { id } = req.user;
      const result = await this.userOnlineService.getAllOnlineOfUserForYear(id, startDate, endDate);
      return new ResponseData<UserOnline[]>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserOnline>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('chart-online-follow-user')
  async getOnlienUser(@Query('id') id: number) {
    try {
      const result = await this.userOnlineService.getOnlineUser(id);
      return new ResponseData<UserOnline[]>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserOnline>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
