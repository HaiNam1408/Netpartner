import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { InfomationsService } from './infomations.service';
import { Infomation } from 'src/typeorm/entities/infomation';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateInfomationDto } from './dto/createInfomation.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { GetAllInfomationDto } from './dto/getAllInfomation.dto';
import { UpdateInfomationDto } from './dto/updateInfomation.dto';

@ApiBearerAuth()
@ApiTags('infomations')
@Controller('infomations')
export class InfomationsController {
    constructor(private readonly infomationService:InfomationsService){}

    @UseGuards(AuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'file', maxCount: 1 }
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'User data with files',
        type: CreateInfomationDto,
    })
    @Post('create-Infomation')
    async create(
      @Body() data: CreateInfomationDto,
      @Req() req,
      @UploadedFiles() files: { 
        cover?: Express.Multer.File[], 
        file?: Express.Multer.File[]
      })  {
      try {
        const cover = files.cover?.[0];
        const file = files.file?.[0];
        const {id} = req.user;
        const InfomationFolder = './uploads/infomation';
        await this.infomationService.createInfomation(data,id,file,cover,InfomationFolder);
        return new ResponseData<String>("Tạo Infomation thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Infomation>(null, HttpStatus.ERROR, error.message);
      }
    }
  
    @UseGuards(AuthGuard)
    @Get('find-all-Infomation')
    async findAll(@Query() {limit,page}:GetAllInfomationDto) {
      try {
        const result = await this.infomationService.findAllInfomation(page,limit);
        return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Infomation>(null, HttpStatus.ERROR, error.message);
      }
    }

    @UseGuards(AuthGuard)
    @Get('find-Infomation/:id')
    async findInfomationId(@Param('id', ParseIntPipe) id:number) {
      try {
        const result = await this.infomationService.findInfomationId(id);
        return new ResponseData<Infomation>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Infomation>(null, HttpStatus.ERROR, error.message);
      }
    }

    @UseInterceptors(FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'file', maxCount: 1 }
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'User data with files',
        type: UpdateInfomationDto,
    })
    @UseGuards(AuthGuard)
    @Patch('update-Infomation/:id')
    async updateInfomation(
        @Param('id',ParseIntPipe) id: number,
        @Body() data:UpdateInfomationDto,
        @UploadedFiles() files: { 
          cover?: Express.Multer.File[], 
          file?: Express.Multer.File[]
        }
    ) {
      try {
        const cover = files.cover?.[0];
        const file = files.file?.[0];
        await this.infomationService.updateInfomation(data,id,file,cover);
        return new ResponseData<String>("Cập nhật thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Infomation>(null, HttpStatus.ERROR, error.message);
      }
    }
  
    @UseGuards(AuthGuard)
    @Delete('delete-Infomation/:id')
    async removeInfomation(@Param('id',ParseIntPipe) id: number) {
      try {
        await this.infomationService.removeInfomation(id);
        return new ResponseData<String>("Xoá thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Infomation>(null, HttpStatus.ERROR, error.message);
      }
    }
}
