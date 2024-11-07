import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { ApiBearerAuth, ApiBody, ApiTags, PartialType } from '@nestjs/swagger';
import { GetAllCommissionDto } from './dto/getAllCommission.dto';
import { ResponseData } from 'src/global/globalClass';
import { Commissions } from 'src/typeorm/entities/commissions';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { GetUserCommissionDto } from './dto/getUserComission.dto';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { CreateCommissionDto } from './dto/createCommission.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('commission')
@Controller('commissions')
export class CommissionsController {
  constructor(private commissionService: CommissionsService) {}

  @Post('import-from-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importFromCSV(@UploadedFile() file: Express.Multer.File){
    if (!file) {
      throw new HttpException('CSV file is required', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.commissionService.importFromCSV(file.buffer);
      return { message: 'CSV data processed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({ type: [CreateCommissionDto] })
  @Post('create-commissions')
  async createCommissions(@Body() body: CreateCommissionDto[]) {
    try {
      const result = await this.commissionService.createCommissions(body);
      return new ResponseData<Commissions>(
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
  @Get('commission-customer')
  async getAllCommission(@Query() query: GetAllCommissionDto, @Req() req) {
    try {
      const { user_code } = req.user;

      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }

      const result = await this.commissionService.getAllCommissions(
        {
          keyword: query.keyword,
          dateRange: dateRange,
          limit: query.limit,
          page: query.page,
        },
        user_code,
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
  @Get('get-user-commission')
  async getUserCommission(@Query() query: GetUserCommissionDto) {
    try {
      const result = await this.commissionService.getUserCommissions(
        query.user_code,
        query.limit,
        query.page,
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

  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({ type: PartialType(CreateCommissionDto) })
  @Put('update-commission/:id')
  async updateCommission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommissionDto: Partial<CreateCommissionDto>,
  ) {
    try {
      await this.commissionService.updateCommission(id, updateCommissionDto);
      return new ResponseData<String>(
        'Cập nhật Commission thành công',
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

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete-commission/:id')
  async deleteCommission(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.commissionService.deleteCommission(id);
      return new ResponseData<String>(
        'Xóa Commission thành công',
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
