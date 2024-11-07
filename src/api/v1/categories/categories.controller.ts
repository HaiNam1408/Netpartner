import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { CreateCategoryDto } from './dto/createCategories.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Category } from 'src/typeorm/entities/categories';
import { CategoryTitleDto } from './dto/getCategoryFollowTitle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';


@ApiBearerAuth()
@ApiTags('category')
@Controller('categories')
export class CategoriesController {
    constructor(private CategoryService:CategoriesService){}
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.CEO)
    @Post('create-category')
    @UseInterceptors(NoFilesInterceptor())
    async create(@Body() createBranchDto: CreateCategoryDto) {
      try {
        await this.CategoryService.createCategory(createBranchDto);
        return new ResponseData<String>("Tạo Category thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Category>(null, HttpStatus.ERROR, error.message);
      }
    }
  
    @UseGuards( AuthGuard )
    @Get('find-all-category')
    async findAll(@Query(){title}:CategoryTitleDto) {
      try {
        const result = await this.CategoryService.findAllCategory(title);
        return new ResponseData<Category[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Category>(null, HttpStatus.ERROR, error.message);
      }
  
    }
  
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.CEO)
    @Delete('delete-category/:id')
    async removeCategory(@Param('id',ParseIntPipe) id: number) {
      try {
        await this.CategoryService.removeCategory(id);
        return new ResponseData<String>("Xoá thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Category>(null, HttpStatus.ERROR, error.message);
      }
    }
}
