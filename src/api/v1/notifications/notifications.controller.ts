import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Notifications } from 'src/typeorm/entities/Notifications';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { PaginationNotificationDto } from './dto/paginationNotification.dto';
import { BroadCasts } from 'src/typeorm/entities/broadCasts';
import { UpdateNotificationDto } from './dto/updateNotification.dto';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}
  @UseGuards(AuthGuard)
  @Post('create-support')
  async createNotification(@Body() body: CreateNotificationDto, @Req() req) {
    try {
      const { id } = req.user;
      await this.notificationService.createNotification(body, id);
      return new ResponseData<string>(
        'Tạo thông báo thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Notifications>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-notification-send')
  async getNotificationSend(
    @Query() { limit, page }: PaginationNotificationDto,
    @Req() req,
  ) {
    try {
      const { id } = req.user;
      const result = await this.notificationService.getNotificationSend(
        id,
        limit,
        page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Notifications>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-notification/:id')
  async getNotificationId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.notificationService.getNotificationId(id);
      return new ResponseData<Notifications>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Notifications>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('recive-notification')
  async reciveNotification(
    @Query() { limit, page }: PaginationNotificationDto,
    @Req() req,
  ) {
    try {
      const { id } = req.user;
      const result = await this.notificationService.reciveNotification(
        id,
        limit,
        page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<BroadCasts>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-notification-status/:id')
  async updateNotificationStatus(
    @Req() req,
    @Param('id', ParseIntPipe) broadCastId: number,
  ) {
    try {
      const { id } = req.user;
      await this.notificationService.updateNotificationStatus(id, broadCastId);
      return new ResponseData<String>(
        'Bạn đã đọc thông báo',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<BroadCasts>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put('update-notification/:id')
  async updateNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNotificationDto,
  ) {
    try {
      const result = await this.notificationService.updateNotification(
        id,
        body,
      );
      return new ResponseData<Notifications>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Notifications>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-notification/:id')
  async deleteNotification(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.notificationService.deleteNotification(id);
      return new ResponseData<string>(
        'Xóa thông báo thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Notifications>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
