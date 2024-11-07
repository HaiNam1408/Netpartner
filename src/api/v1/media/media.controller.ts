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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto } from './dto/createMedia.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Media } from 'src/typeorm/entities/media';
import { GetAllMediaDto } from './dto/getAllMedia.dto';
import { UpdateMediaDto } from './dto/updateMedia.dto';

@ApiBearerAuth()
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @UseGuards(AuthGuard)
  @Post('create-media')
  async create(@Body() data: CreateMediaDto, @Req() req) {
    try {
      const { id } = req.user;
      await this.mediaService.createMedia(data, id);
      return new ResponseData<String>(
        'Tạo media thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Media>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-all-media')
  async findAll(@Query() { title, type, limit, page, date }: GetAllMediaDto) {
    try {
      var dateRange: [Date, Date] | undefined;
      if (date && Array.isArray(date) && date.length === 2) {
        dateRange = [new Date(date[0]), new Date(date[1])];
      }
      const result = await this.mediaService.findAllMedia(
        title,
        type,
        dateRange,
        page,
        limit,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Media>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-media/:id')
  async findMediaId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.mediaService.findMediaId(id);
      return new ResponseData<Media>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Media>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-Media/:id')
  async updateMedia(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMediaDto,
  ) {
    try {
      await this.mediaService.updateMedia(data, id);
      return new ResponseData<String>(
        'Cập nhật thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Media>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-media/:id')
  async removeMedia(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.mediaService.removeMedia(id);
      return new ResponseData<String>(
        'Xoá thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Media>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('pin/:id')
  async pinMedia(@Param('id') id: string, @Query('isPinned') isPinned: string) {
    try {
      // Chuyển đổi `isPinned` thành kiểu boolean từ chuỗi
      const isPinnedBool = isPinned === 'true';

      await this.mediaService.pinMedia(Number(id), isPinnedBool);

      return new ResponseData<string>(
        isPinnedBool
          ? 'Ghim bài viết thành công!'
          : 'Bỏ ghim bài viết thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<null>(null, HttpStatus.ERROR, error.message);
    }
  }
}
