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
import { AchievementLogService } from './achievement-log.service';
import { GetAllAchievementLogDTO } from './dto/get-all-milestones-tree.dto';
import { AchievementLog } from 'src/typeorm/entities/achievement-log.entity';
import { CreateUpdateAchievementLogDTO } from './dto/create-update-milestones-tree.dto';

@ApiBearerAuth()
@ApiTags('AchievementLog')
@Controller('achievement-log')
export class AchievementLogController {
  constructor(private readonly service: AchievementLogService) {}

  // @UseGuards(AuthGuard)
  @Get()
  @UseInterceptors(NoFilesInterceptor())
  async index(@Query() dto: GetAllAchievementLogDTO): Promise<any> {
    try {
      const result = await this.service.getAllAchievementLogs(dto);
      return new ResponseData<PaginatedResult<AchievementLog>>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PaginatedResult<AchievementLog>>(
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
      const result = await this.service.getDetailsAchievementLog(id);
      return new ResponseData<AchievementLog>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementLog>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  // @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() dto: CreateUpdateAchievementLogDTO): Promise<any> {
    try {
      const result = await this.service.createAchievementLog(dto);
      return new ResponseData<AchievementLog>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementLog>(
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
    @Body() dto: CreateUpdateAchievementLogDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      await this.service.updateAchievementLog(dto, id);
      return new ResponseData<string>(
        'Update Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementLog>(
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
      await this.service.deleteAchievementLog(id);
      return new ResponseData<string>(
        'Delete Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<AchievementLog>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
