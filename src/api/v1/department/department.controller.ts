import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/api/decorator/role.decorator';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Role } from 'src/typeorm/enum/role.enum';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { Department } from 'src/typeorm/entities/department';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('department')
@Controller('department')
export class DepartmentController {
    constructor(private departmentService:DepartmentService){}
    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-department')
    async create(@Body() createBranchDto: CreateDepartmentDto) {
      try {
        await this.departmentService.createDepartment(createBranchDto);
        return new ResponseData<String>("Tạo department thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Department>(null, HttpStatus.ERROR, error.message);
      }
    }
  
  
    @Get('find-all-department')
    async findAll() {
      try {
        const result = await this.departmentService.findAllDepartment();
        return new ResponseData<Department[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Department>(null, HttpStatus.ERROR, error.message);
      }
  
    }
  
    @UseGuards(AuthGuard)
    @Delete('delete-department/:id')
    async removedepartment(@Param('id',ParseIntPipe) id: number) {
      try {
        await this.departmentService.removeDepartment(id);
        return new ResponseData<String>("Xoá thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Department>(null, HttpStatus.ERROR, error.message);
      }
    }
}
