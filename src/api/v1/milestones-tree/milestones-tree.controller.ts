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
import { MilestonesTree } from 'src/typeorm/entities/milestones-tree.entity';
import { CreateUpdateMilestonesTreeDTO } from './dto/create-update-milestones-tree.dto';
import { GetAllMilestonesTreeDTO } from './dto/get-all-milestones-tree.dto';
import { MilestonesTreeService } from './milestones-tree.service';

@ApiBearerAuth()
@ApiTags('MilestonesTree')
@Controller('milestones-tree')
export class MilestonesTreeController {
  constructor(private readonly service: MilestonesTreeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UseInterceptors(NoFilesInterceptor())
  async index(@Query() dto: GetAllMilestonesTreeDTO): Promise<any> {
    try {
      const result = await this.service.getAllMilestonesTrees(dto);
      return new ResponseData<PaginatedResult<MilestonesTree>>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PaginatedResult<MilestonesTree>>(
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
      const result = await this.service.getDetailsMilestonesTree(id);
      return new ResponseData<MilestonesTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<MilestonesTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() dto: CreateUpdateMilestonesTreeDTO): Promise<any> {
    try {
      const result = await this.service.createMilestonesTree(dto);
      return new ResponseData<MilestonesTree>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<MilestonesTree>(
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
    @Body() dto: CreateUpdateMilestonesTreeDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      await this.service.updateMilestonesTree(dto, id);
      return new ResponseData<string>(
        'Update Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<MilestonesTree>(
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
      await this.service.deleteMilestonesTree(id);
      return new ResponseData<string>(
        'Delete Successfully',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<MilestonesTree>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }
}
