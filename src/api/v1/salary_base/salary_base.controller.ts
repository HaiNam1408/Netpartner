import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SalaryBaseService } from './salary_base.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateSalaryDto } from './dto/createSalaryDto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('salary-base')
@Controller('salary-base')
export class SalaryBaseController {
    constructor(private salaryService:SalaryBaseService){}

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-salary-base')
    async createAffiliate(@Body() body:CreateSalaryDto){
        try {
            const result = await this.salaryService.createSalary(body);
            return new ResponseData<string>("Tạo thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<SalaryBase>(null, HttpStatus.ERROR, error.message);
        }
    }
}
