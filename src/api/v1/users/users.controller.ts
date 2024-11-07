import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseIntPipe,
  Patch,
  Put,
  Req,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Users } from 'src/typeorm/entities/users';
import { UsersService } from './users.service';
import { CreateDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { QueryUserDto } from './dto/queryUser.dto';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { PaginatedResult } from 'src/global/globalPagination';
import { Subordinate } from './dto/subordinate.dto';
import { PaginationHistoryDto } from './dto/paginationHistory.dto';
import { forgotPasswordDTO } from './dto/forgotPssword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  async register(
    @Body() createUserDto: CreateDto,
  ) {
    try {
      await this.usersService.register(
        createUserDto
      );

      return new ResponseData<string>(
        'Đăng ký thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in')
  async login(@Body() data: LoginDTO) {
    try {
      const result = await this.usersService.login(data);
      return new ResponseData<Object>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch('update-user/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    try {
      const result = await this.usersService.updateUser(
        body,
        id,
      );
      return new ResponseData<String>(
        'Cập nhật thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('get-all-user-follow-option')
  async getAllUserFollowOption(@Query() query: QueryUserDto, @Req() req) {
    try {
      const { user_code } = req.user;
      const result = await this.usersService.getAllUserFollowOption(
        {
          keyword: query.keyword,
          branch_id: query.branch_id,
          department_id: query.department_id,
          role: query?.role,
          page: query.page || 1,
          limit: query.limit || 10,
        },
        user_code,
      );

      return new ResponseData<
        PaginatedResult<Users & { managerInfo?: Partial<Users> }>
      >(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<null>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-user-block')
  async getAllUserWasBlock(@Query() query: QueryUserDto, @Req() req) {
    try {
      const { user_code } = req.user;
      const result = await this.usersService.getAllUserWasBlock(
        {
          keyword: query.keyword,
          branch_id: query.branch_id,
          department_id: query.department_id,
          role: query?.role,
          page: query.page || 1,
          limit: query.limit || 10,
        },
        user_code,
      );

      return new ResponseData<
        PaginatedResult<Users & { managerInfo?: Partial<Users> }>
      >(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<null>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-user-pending')
  async getListUserPending(@Query() query: QueryUserDto, @Req() req) {
    try {
      const { user_code } = req.user;
      const result = await this.usersService.getListUserPending(
        {
          keyword: query.keyword,
          branch_id: query.branch_id,
          department_id: query.department_id,
          role: query?.role,
          page: query.page || 1,
          limit: query.limit || 10,
        },
        user_code,
      );

      return new ResponseData<
        PaginatedResult<Users & { managerInfo?: Partial<Users> }>
      >(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<null>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-user/:id')
  async getUserId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.usersService.getUserId(id);
      return new ResponseData<Users>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @Get('get-customer/:id')
  async getcustomerId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.usersService.getCustomerId(id);
      return new ResponseData<Users>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-user/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const { user_code, role } = req.user;
      await this.usersService.deleteUser(id, user_code, role);
      return new ResponseData<String>(
        'Xóa user thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('block-user/:id')
  async blockUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const { user_code, role } = req.user;
      await this.usersService.blockUser(id, user_code, role);
      return new ResponseData<String>(
        'Tạm khóa người dùng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('unlock-user/:id')
  async unLockUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const { user_code, role } = req.user;
      await this.usersService.unLockUser(id, user_code, role);
      return new ResponseData<String>(
        'Mở khóa người dùng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('history')
  async historyDeleteUser(
    @Req() req,
    @Query() { limit, page }: PaginationHistoryDto,
  ) {
    try {
      const { user_code, role } = req.user;
      const result = await this.usersService.getUserDelete(
        user_code,
        role,
        limit,
        page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-subordinate-leader')
  async getListSubordinateLeader(@Query() { id }: Subordinate) {
    try {
      const result = await this.usersService.getAllSubordinatesFlat(id);
      return new ResponseData<Object>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @Post('forgotPassword')
  async forgotPassword(
    @Body() body: forgotPasswordDTO,
    @Req() req,
  ): Promise<any> {
    try {
      const result = await this.usersService.forgotPassword(body);
      return new ResponseData<Object>(
        'Vui lòng kiểm tra email của bạn',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Users>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Put('changePassword')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req,
  ): Promise<ResponseData<Object>> {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword } = body;

      await this.usersService.changePassword(id, oldPassword, newPassword);

      return new ResponseData<Object>(
        'Đổi mật khẩu thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Object>(null, HttpStatus.ERROR, error.message);
    }
  }
}
