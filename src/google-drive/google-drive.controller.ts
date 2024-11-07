import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from './google-drive.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@ApiTags('google-drive')
@Controller('upload')
export class UploadController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('product_link'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        product_link: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ResponseData<any>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const response = await this.googleDriveService.uploadFile(
        file.originalname,
        file.buffer,
        file.mimetype,
      );
      return new ResponseData<any>(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }
  }
}