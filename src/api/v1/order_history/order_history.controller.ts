import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { Commissions } from 'src/typeorm/entities/commissions';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { OrderHistoryService } from './order_history.service';
import { GetOrderHistoryDto } from './dto/getOrderHistory.dto';

@ApiBearerAuth()
@ApiTags('order-history')
@Controller('order-history')
export class orderHistoryController {
    constructor(private orderHistoryService:OrderHistoryService){}

    @UseGuards(AuthGuard)
    @Get('sactistics')
    async sactisticRegisterCustomer(
    ) {
        try {
            const result = await this.orderHistoryService.sactisticRegisterCustomer();
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Commissions>(null, HttpStatus.ERROR, error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Get('get-order-history')
    async getRegisterCustomer(
        @Query() query: GetOrderHistoryDto,
        @Req() req
    ) {
        try {
            const { user_code } = req.user;
            
            var dateRange: [Date, Date] | undefined;
            if (query.date && Array.isArray(query.date) && query.date.length === 2) {
                dateRange = [new Date(query.date[0]), new Date(query.date[1])];
            }
            
            const result = await this.orderHistoryService.getRegisterCustomer(
                {
                    keyword:query.keyword,
                    dateRange:dateRange,
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
