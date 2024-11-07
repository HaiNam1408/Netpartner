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
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video-ytb.service';
import { CreateVideoWithQuestionsDto } from './dto/createVideoYtb.dto';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CheckAnswersDto } from './dto/checkAnswer.dto';
import { getPaginationVideo } from './dto/paginationVideo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getUserProcessDto } from './dto/getUserProcess.dto';
import { getVideoUserIdDto } from './dto/getVideoUserId.dto';

@ApiBearerAuth()
@ApiTags('video-ytb')
@Controller('video-ytb')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-video-and-question')
  async createVideoWithQuestions(
    @Body() createVideoDto: CreateVideoWithQuestionsDto,
  ) {
    await this.videoService.createVideoWithQuestions(createVideoDto);
    return new ResponseData<String>(
      'Tạo video và câu hỏi thành công',
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('check-answer')
  async checkAnswersAndGetNextVideo(@Body() data: CheckAnswersDto, @Req() req) {
    try {
      const { videoId, userAnswers } = data;
      const { id } = req.user;
      const result = await this.videoService.checkAnswers(
        id,
        videoId,
        userAnswers,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-video-user')
  async getAllVideoUser(
    @Query() { limit, page, type }: getPaginationVideo,
    @Req() req,
  ) {
    try {
      const { id } = req.user;
      const result = await this.videoService.getAllVideoUser(
        id,
        limit,
        page,
        type,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-user-process')
  async getUserProcess(@Query() dto: getUserProcessDto) {
    try {
      const result = await this.videoService.getUserProcess(
        dto.userId,
        dto.type,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-video')
  async getAllVideo(
    @Query() { limit, page, type }: getPaginationVideo,
    @Req() req,
  ) {
    try {
      const { id } = req.user;
      const result = await this.videoService.getAllVideoWithQuestion(
        id,
        limit,
        page,
        type,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-video-user/:id')
  async getVideoUserId(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Query() dto: getVideoUserIdDto,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.videoService.getVideoUserId(
        id,
        userId,
        dto.type,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-video/:id')
  async getVideoId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.videoService.getVideoId(id);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('update-video/:id')
  async updateVideoId(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: CreateVideoWithQuestionsDto,
  ) {
    try {
      const result = await this.videoService.updateVideoAndQuestion(
        id,
        updateVideoDto,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-video/:id')
  async deleteVideoId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.videoService.deleteVideo(id);
      return new ResponseData<any>(
        'Xóa thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-question/:id')
  async deleteQuestionId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.videoService.deleteQuestion(id);
      return new ResponseData<any>(
        'Xóa thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<String>(
        error.message,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
