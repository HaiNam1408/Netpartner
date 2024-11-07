import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LearningStepService } from './learning_step.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLearningPathDto } from './dto/createLearning.dto';
import { LearningPath } from 'src/typeorm/entities/learing-path';
import { UpdateLearningPathDto } from './dto/updateDto.dto';

@ApiBearerAuth()
@ApiTags('learning-path')
@Controller('learning-path')
export class LearningStepController {
  constructor(private readonly learningPathService: LearningStepService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-learning-path')
  async createLearningPath(
    @Body() createLearningPathDto: CreateLearningPathDto,
  ) {
    try {
      await this.learningPathService.createLearningPath(createLearningPathDto);
      return new ResponseData<string>(
        'Tạo lộ trình thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<LearningPath>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Put('update-progress/:itemId')
  async updateUserProgress(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() body: { isCompleted: boolean },
    @Req() req
  ) {
    try {
      await this.learningPathService.updateUserProgress(
        req.user.id,
        itemId,
        body.isCompleted,
      );
      return new ResponseData<string>(
        'Cập nhật lộ trình thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<LearningPath>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-user-learning-path/:userId')
  async getUserLearningPaths(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const reuslt =
        await this.learningPathService.getUserLearningPaths(userId);
      return new ResponseData<any>(
        reuslt,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<LearningPath>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-learning-path')
  async getLearningPaths(@Query('id') id: number) {
    try {
      const reuslt = await this.learningPathService.getLearningPaths(id);
      return new ResponseData<any>(
        reuslt,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<LearningPath>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-learning-path/:id')
  async getLearningPathId(@Param('id', ParseIntPipe) id: number) {
    try {
      const reuslt = await this.learningPathService.getLearningPathId(id);
      return new ResponseData<any>(
        reuslt,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<LearningPath>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-tree/:id')
  async updateTree(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLearningPathDto: UpdateLearningPathDto,
  ) {
    const reuslt = await this.learningPathService.updateLearningPath(
      id,
      updateLearningPathDto,
    );
    return new ResponseData<any>(
      'Cập nhật thành công',
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete-tree/:id')
  async deleteTree(@Param('id', ParseIntPipe) id: number) {
    try {
      const reuslt = await this.learningPathService.deleteLearningPath(id);
      return new ResponseData<any>(
        'Xóa thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<any>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-tree-item/:id')
  async deleteTreeItem(@Param('id', ParseIntPipe) id: number) {
    try {
      const reuslt = await this.learningPathService.deleteItem(id);
      return new ResponseData<any>(
        'Xóa thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<any>(null, HttpStatus.ERROR, error.message);
    }
  }
}
