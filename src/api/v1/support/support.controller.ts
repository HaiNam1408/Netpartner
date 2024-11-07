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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/createSupport.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Support } from 'src/typeorm/entities/support';
import { PaginationSupportDto } from './dto/pagination.dto';
import { UpdateStatusSupportDto } from './dto/updateStatus.dto';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import {
  FileFieldsInterceptor,
  NoFilesInterceptor,
} from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('support')
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'User data with files',
    type: CreateSupportDto,
  })
  @Post('create-support')
  async createSupport(@Body() body: CreateSupportDto, @Req() req) {
    try {
      const authorId = req.user.id;
      await this.supportService.createSupport(body, authorId);
      return new ResponseData<String>(
        'Tạo support thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Support>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-request')
  async getAllRequest(
    @Query() { limit, page, type }: PaginationSupportDto,
    @Req() req,
  ) {
    try {
      const { role, id, user_code } = req.user;
      const result = await this.supportService.getAllRequest(
        limit,
        page,
        type,
        role,
        id,
        user_code,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Support>(null, HttpStatus.ERROR, error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('get-request/:id')
  async getRequestId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.supportService.getRequesId(id);
      return new ResponseData<Support>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Support>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('update-status/:id')
  async updateStatusSupport(
    @Body() { status }: UpdateStatusSupportDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<any> {
    try {
      const { user_code, role } = req.user;
      await this.supportService.updateStatusRequest(
        status,
        id,
        user_code,
        role,
      );
      return new ResponseData<String>(
        'Cập nhật trạng thái thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Support>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-support/:id')
  async deleteSupport(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.supportService.deleteSupport(id);
      return new ResponseData<String>(
        'Xóa thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Support>(null, HttpStatus.ERROR, error.message);
    }
  }
}
