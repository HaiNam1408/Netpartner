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
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { PaginatedResult } from 'src/global/globalPagination';
import { UserProcessAchievementTreeService } from './user-process-achievement-tree.service';
import { GetAllUserProcessAchievementTreeDTO } from './dto/get-all-user-process-achievement-tree.dto';
import { UserProcessAchievementTree } from 'src/typeorm/entities/user-process-achievement-tree.entity';
import { CreateUpdateUserProcessAchievementTreeDTO } from './dto/create-update-user-process-achievement-tree.dto';

@ApiBearerAuth()
@ApiTags('UserProcessAchievementTree')
@Controller('user-process-achievement-tree')
export class UserProcessAchievementTreeController {
  constructor(private readonly service: UserProcessAchievementTreeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UseInterceptors(NoFilesInterceptor())
  async index(@Query() dto: GetAllUserProcessAchievementTreeDTO): Promise<any> {
    try {
      const result = await this.service.getAllUserProcessAchievementTrees(dto);
      return new ResponseData<PaginatedResult<UserProcessAchievementTree>>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PaginatedResult<UserProcessAchievementTree>>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @UseInterceptors(NoFilesInterceptor())
  async manualCrawlUserProcess(): Promise<ResponseData<any>> {
    try {
      await this.service.handleCronUserProcessPerDay();
      return new ResponseData<string>(
        'OK',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PaginatedResult<UserProcessAchievementTree>>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async getDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result =
        await this.service.getDetailsUserProcessAchievementTree(id);
      return new ResponseData<UserProcessAchievementTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserProcessAchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(
    @Body() dto: CreateUpdateUserProcessAchievementTreeDTO,
  ): Promise<any> {
    try {
      const result = await this.service.createUserProcessAchievementTree(dto);
      return new ResponseData<UserProcessAchievementTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserProcessAchievementTree>(
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
    @Body() dto: CreateUpdateUserProcessAchievementTreeDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      await this.service.updateUserProcessAchievementTree(dto, id);
      return new ResponseData<string>(
        'Update Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserProcessAchievementTree>(
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
      await this.service.deleteUserProcessAchievementTree(id);
      return new ResponseData<string>(
        'Delete Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserProcessAchievementTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
