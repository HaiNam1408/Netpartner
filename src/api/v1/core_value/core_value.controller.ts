import { Body, Controller, Get, Param, ParseIntPipe, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoreValueService } from './core_value.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateSettingDto } from './dto/setting.dto';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Settings } from 'src/typeorm/entities/settings';
@ApiBearerAuth()
@ApiTags('core-value')
@Controller('core-value')
export class CoreValueController {
    constructor(private settingService:CoreValueService){}
    
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'User data with files',
        type: UpdateSettingDto,
    })
    @UseGuards(AuthGuard)
    @Patch('setting/:id')
    async updateMedia(
      @Param('id',ParseIntPipe) id: number,
      @Body() data:UpdateSettingDto,
      @UploadedFile() file: Express.Multer.File|undefined
    ) {
      try {
        await this.settingService.updateSetting(id,data,file);
        return new ResponseData<String>("Cập nhật thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Settings>(null, HttpStatus.ERROR, error.message);
      }
    }

    @UseGuards(AuthGuard)
    @Get('get-value-core')
    async getAllSetting() {
        try {
          const result = await this.settingService.getAll();
          return new ResponseData<Settings[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Settings>(null, HttpStatus.ERROR, error.message);
        }
      }
}
