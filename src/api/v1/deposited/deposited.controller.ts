import { Controller, Get, HttpException, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { Commissions } from 'src/typeorm/entities/commissions';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { DepositedService } from './deposited.service';
import { GetDepositedCustomerDto } from './dto/getDeposited.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('doposited')
@Controller('doposited')
export class DepositedController {
    constructor(private depositedService:DepositedService){}

    @Post('upload-csv')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDepositedCustomerCSV(@UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
        if (!file) {
            throw new HttpException('CSV file is required', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.depositedService.createDepositedCustomerFromCSV(file.buffer);
            return { message: 'CSV data processed successfully' };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.ERROR);
        }
    }


    @UseGuards(AuthGuard)
    @Get('get-doposited-customer')
    async getRegisterCustomer(
        @Query() query: GetDepositedCustomerDto,
        @Req() req
    ) {
        try {
            const { user_code } = req.user;
            
            var dateRange: [Date, Date] | undefined;
            if (query.date && Array.isArray(query.date) && query.date.length === 2) {
                dateRange = [new Date(query.date[0]), new Date(query.date[1])];
            }
            
            const result = await this.depositedService.getRegisterCustomer(
                {
                    keyword:query.keyword,
                    dateRange:dateRange,
                    saler:query.saler,
                    maketing:query.maketing,
                    limit:query.limit,
                    page:query.page,
                },
                user_code
            );
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Commissions>(null, HttpStatus.ERROR, error.message);
        }
    }
}
