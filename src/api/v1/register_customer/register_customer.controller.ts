import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { Commissions } from 'src/typeorm/entities/commissions';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RegisterCustomerService } from './register_customer.service';
import { GetRegisterCustomerDto } from './dto/get_register_customer.dto';

@ApiBearerAuth()
@ApiTags('register-customer')
@Controller('register-customer')
export class RegisterCustomerController {
    constructor(private registerCustomerService:RegisterCustomerService){}

    @UseGuards(AuthGuard)
    @Get('get-register-customer')
    async getRegisterCustomer(
        @Query() query: GetRegisterCustomerDto,
        @Req() req
    ) {
        try {
            const { user_code } = req.user;
            
            var dateRange: [Date, Date] | undefined;
            if (query.date && Array.isArray(query.date) && query.date.length === 2) {
                dateRange = [new Date(query.date[0]), new Date(query.date[1])];
            }
            
            const result = await this.registerCustomerService.getRegisterCustomer(
                {
                    keyword:query.keyword,
                    dateRange:dateRange,
                    saler:query.saler,
                    maketing: query.maketing,
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

    @UseGuards(AuthGuard)
    @Get('sactistics')
    async sactisticRegisterCustomer(
    ) {
        try {
            const result = await this.registerCustomerService.sactisticRegisterCustomer();
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Commissions>(null, HttpStatus.ERROR, error.message);
        }
    }
}
