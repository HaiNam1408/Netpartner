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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { CreateEducationDto } from './dto/createEducation.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Education } from 'src/typeorm/entities/education';
import { GetAllBEducationDto } from './dto/getAllEducation.dto';
import { UpdateEducationDto } from './dto/updateEducation.dto';

@ApiBearerAuth()
@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'User data with files',
    type: CreateEducationDto,
  })
  @Post('create-education')
  async create(@Body() data: CreateEducationDto, @Req() req) {
    try {
      const { id } = req.user;
      await this.educationService.createEducation(data, id);
      return new ResponseData<String>(
        'Tạo education thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Education>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-all-education')
  async findAll(
    @Query()
    { title, categoryId, playListId, limit, page }: GetAllBEducationDto,
  ) {
    try {
      const result = await this.educationService.findAllEducation(
        title,
        categoryId,
        playListId,
        page,
        limit,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Education>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-education/:id')
  async findEducationId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.educationService.findEducationId(id);
      return new ResponseData<Education>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Education>(null, HttpStatus.ERROR, error.message);
    }
  }

  @ApiBody({
    description: 'User data with files',
    type: UpdateEducationDto,
  })
  @UseGuards(AuthGuard)
  @Patch('update-education/:id')
  async updateEducation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEducationDto,
  ) {
    try {
      await this.educationService.updateEducation(data, id);
      return new ResponseData<String>(
        'Cập nhật thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Education>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-education/:id')
  async removeeducation(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.educationService.removeEducation(id);
      return new ResponseData<String>(
        'Xoá thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Education>(null, HttpStatus.ERROR, error.message);
    }
  }
}
