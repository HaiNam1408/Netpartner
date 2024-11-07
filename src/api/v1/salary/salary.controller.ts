import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { PaginationSalaryDto } from './dto/paginationSalary.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Salary } from 'src/typeorm/entities/salary';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { UpdateSalaryDto } from './dto/updateSalary.dto';
import { CreateSalaryBase } from './dto/createSalaryBase.dto';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { GetSalaryDto } from './dto/getSalary.dto';
@ApiBearerAuth()
@ApiTags('salary')
@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @UseGuards(AuthGuard)
  @Get('get-salary-users')
  async getSalaryUsers(@Query() query: PaginationSalaryDto) {
    try {
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const result = await this.salaryService.getSalaryUsers({
        keyword: query.keyword,
        dateRange: dateRange,
        limit: query.limit,
        page: query.page,
      });
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Salary>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-salary-user')
  async getSalaryUserId(@Req() req, @Query() {startDate, endDate}: GetSalaryDto) {
    try {
      const { id } = req.user;
      const result = await this.salaryService.getSalaryUserId(id, startDate, endDate);
      return new ResponseData<Salary>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Salary>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-salary-user-id/:id')
  async getSalaryByUserId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.salaryService.getSalaryUserId(id);
      return new ResponseData<Salary>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Salary>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('add-salary-bonus/:id')
  async updateSalary(
    @Param('id', ParseIntPipe) id: number,
    @Body() {extra_salary, salary_bonus}: UpdateSalaryDto,
  ) {
    try {
      await this.salaryService.addBonusSalary(id, extra_salary, salary_bonus);
      return new ResponseData<String>(
        'Cập nhật thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Salary>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-salary-base')
  async updateSalaryBase(@Body() data: CreateSalaryBase) {
    try {
      const result = await this.salaryService.createSalary(data);
      return new ResponseData<string>(
        'Tạo thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<SalaryBase>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-salary-base')
  async getAllSalaryBase() {
    try {
      const result = await this.salaryService.getAllSalaryBase();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<SalaryBase>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-salary-base/:id')
  async getSalaryBaseId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.salaryService.getSalaryBaseId(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<SalaryBase>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
