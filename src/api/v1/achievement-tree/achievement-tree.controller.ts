import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AchievementTreeService } from './achievement-tree.service';
import { AchievementTree } from 'src/typeorm/entities/achievement-tree.entity';
import { CreateUpdateAchievementTreeDTO } from './dto/create-update-achievement-tree.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { GetAllAchievementTreeDTO } from './dto/get-all-achivement-tree.dto';
import { PaginatedResult } from 'src/global/globalPagination';

@ApiBearerAuth()
@ApiTags('AchievementTree')
@Controller('achievement-tree')
export class AchievementTreeController {
  constructor(private readonly service: AchievementTreeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UseInterceptors(NoFilesInterceptor())
  async index(@Query() dto: GetAllAchievementTreeDTO): Promise<any> {
    try {
      const result = await this.service.getAllAchievementTree(dto);
      return new ResponseData<PaginatedResult<AchievementTree>>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PaginatedResult<AchievementTree>>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  // @UseGuards(AuthGuard)
  @Get('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async getDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result = await this.service.getDetailsAchievementTree(id);
      return new ResponseData<AchievementTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() dto: CreateUpdateAchievementTreeDTO): Promise<any> {
    try {
      const result = await this.service.createAchievementTree(dto);
      return new ResponseData<AchievementTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(
    @Body() dto: CreateUpdateAchievementTreeDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      await this.service.updateAchievementTree(dto, id);
      return new ResponseData<string>(
        'Update Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.service.deleteAchievementTree(id);
      return new ResponseData<string>(
        'Delete Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
