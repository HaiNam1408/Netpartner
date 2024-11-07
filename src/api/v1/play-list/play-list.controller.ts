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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { CreatePlayListDto } from './dto/createPlayList.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PlayList } from 'src/typeorm/entities/playList';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { UpdatePlayListDto } from './dto/upadtePlayList.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { TypeEducation } from 'src/typeorm/enum/typeEdu';

@ApiBearerAuth()
@ApiTags('play-list')
@Controller('play-list')
export class PlayListController {
  constructor(private playListService: PlayListService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-play-list')
  async createPlayList(@Body() data: CreatePlayListDto): Promise<any> {
    try {
      await this.playListService.createPlayList(data);
      return new ResponseData<String>(
        'Tạo Playlist thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PlayList>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Patch('update-play-list/:id')
  async updatePlayList(
    @Body() data: UpdatePlayListDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      await this.playListService.updatePlayList(data, id);
      return new ResponseData<String>(
        'Cập nhật Playlist thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PlayList>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-play-list')
  async getAllPlayList(@Query('type') type: TypeEducation): Promise<any> {
    try {
      const result = await this.playListService.getAllPlayList(type);
      return new ResponseData<PlayList[]>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PlayList>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-play-list/:id')
  async getPlayListId(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result = await this.playListService.getPlayListId(id);
      return new ResponseData<PlayList>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PlayList>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-play-list/:id')
  async deletePlayList(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.playListService.deletePlayList(id);
      return new ResponseData<String>(
        'Xóa Playlist thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<PlayList>(null, HttpStatus.ERROR, error.message);
    }
  }
}
