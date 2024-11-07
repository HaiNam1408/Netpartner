import {
  Body,
  Controller,
  Delete,
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
import { TasksService } from './tasks.service';
import { Tasks } from 'src/typeorm/entities/tasks';
import { CreateTaskDto } from './dto/createTaskDto.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Assignments } from 'src/typeorm/entities/assignments';
import { getListPagination } from './dto/getListPagination.dto';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { GetTaskUserDto } from './dto/getTaskUser.dto';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-task')
  async createTask(@Body() body: CreateTaskDto, @Req() req): Promise<any> {
    try {
      const managerId = req?.user?.id;
      await this.taskService.createTask(body, managerId);
      return new ResponseData<String>(
        'Tạo task thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Tasks>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-assignment')
  async getListAssignment(
    @Query() { limit, page, type }: getListPagination,
    @Req() req,
  ): Promise<any> {
    try {
      const result = await this.taskService.getListAssignment(
        type,
        limit,
        page,
        req.user,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Assignments>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-assignment-user')
  async getListAssignmentUser(
    @Query() query: GetTaskUserDto, // Lấy dữ liệu từ query params qua DTO
  ): Promise<any> {
    try {
      const { userId, date, checkerId,type } = query;
      let dateRange: [Date, Date] | undefined = undefined;

      // Kiểm tra nếu `date` là array có 2 phần tử thì chuyển nó thành mảng dateRange
      if (date && Array.isArray(date) && date.length === 2) {
        dateRange = [new Date(date[0]), new Date(date[1])];
      }

      const result = await this.taskService.getTaskUser(
        userId,
        checkerId,
        type,
        dateRange,
      ); // Gọi service với dateRange

      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<any>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-users-by-checker')
  async getUsersByChecker(
    @Query() query: GetTaskUserDto, // Lấy dữ liệu từ query params qua DTO
  ): Promise<any> {
    try {
      const { date, checkerId } = query;
      let dateRange: [Date, Date] | undefined = undefined;

      // Kiểm tra nếu `date` là array có 2 phần tử thì chuyển nó thành mảng dateRange
      if (date && Array.isArray(date) && date.length === 2) {
        dateRange = [new Date(date[0]), new Date(date[1])];
      }

      const result = await this.taskService.getUsersByChecker(
        checkerId,
        dateRange,
      ); // Gọi service với dateRange

      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<any>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-assginment-id/:id')
  async getAssignmentId(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result = await this.taskService.getAssignmentId(id);
      return new ResponseData<Assignments>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Assignments>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('chart-task')
  async chartTask(@Req() req): Promise<any> {
    try {
      const { id } = req.user;
      const result = await this.taskService.countTaskStatusForUser(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Assignments>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('update-assignment/:id')
  async updateAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() body: UpdateStatusDto,
  ): Promise<any> {
    try {
      const user_id = req.user.id;
      await this.taskService.updateAssignmentStatus(body, user_id, id);
      return new ResponseData<String>(
        'Cập nhật status assingment thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Tasks>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-assignment/:id')
  async deleteAssignment(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.taskService.deleteAssignment(id);
      return new ResponseData<String>(
        'Xóa assingment thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Tasks>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-assignment-pending')
  async getListAssignmentNotOke(
    @Query() { limit, page, type, start_at, end_at }: getListPagination,
    @Req() req,
  ): Promise<any> {
    try {
      const result = await this.taskService.getAssigmentNotOk(
        req.user.id,
        type,
        limit,
        page,
        start_at,
        end_at,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Assignments>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

}
