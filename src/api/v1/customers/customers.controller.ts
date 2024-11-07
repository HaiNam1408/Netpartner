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
import { CustomersService } from './customers.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Customers } from 'src/typeorm/entities/Customers';
import { GetPagination } from './dto/getPagination.dto';
import { GetCustomersDto } from './dto/getCustomers.dto';
import { GetCustomerBySaler } from './dto/getCustomerBySaler.dto';
import { CreateCustomerDto } from './dto/createCustomers.dto';

@ApiBearerAuth()
@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  @UseGuards(AuthGuard)
  @Post('create-customers')
  @UseInterceptors(NoFilesInterceptor())
  async createCustomers(@Body() body: CreateCustomerDto[], @Req() req) {
    try {
      const { user_code } = req.user;
      await this.customerService.createCustomer(body, user_code);
      return new ResponseData<String>(
        'Tạo Customer thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-customer')
  async GetAllCustomer(@Query() query: GetPagination) {
    try {
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const result = await this.customerService.GetAllCustomer({
        keyword: query.keyword,
        dateRange: dateRange,
        limit: query.limit,
        source: query.source,
        saler: query.saler,
        page: query.page,
        user_code: query.user_code,
      });
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @Post('customer-fill-to-form')
  async CustomerFillToForm(@Body() body: CreateCustomerDto) {
    try {
      const result = await this.customerService.CustomerFillToForm(body);
      return new ResponseData<string>(
        'Khách hàng tạo thông tin thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-customer-follow-saler')
  async GetUserFollowSaler(@Query() query: GetCustomerBySaler, @Req() req) {
    try {
      const { user_code } = req.user;
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const result = await this.customerService.GetUserFollowSaler(
        {
          keyword: query.keyword,
          dateRange: dateRange,
          tag: query.tag,
          saler: query.saler,
          maketing: query.maketing,
          limit: query.limit,
          page: query.page,
        },
        user_code,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-customer-follow-maketer')
  async GetUserFollowMaketer(@Query() query: GetPagination, @Req() req) {
    try {
      const { user_code } = req.user;
      var dateRange: [Date, Date] | undefined;
      if (query.date && Array.isArray(query.date) && query.date.length === 2) {
        dateRange = [new Date(query.date[0]), new Date(query.date[1])];
      }
      const result = await this.customerService.GetUserFollowMaketer(
        {
          keyword: query.keyword,
          dateRange: dateRange,
          tag: query.tag,
          source: query.source,
          saler: query.saler,
          limit: query.limit,
          page: query.page,
        },
        user_code,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('get-customer-by-user')
  async GetCustomerByUser(@Query() query: GetCustomersDto) {
    try {
      const result = await this.customerService.GetCustomerByUser(
        query.user_code,
        query.limit,
        query.page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-customer-satistic')
  async GetCustomerStatistic(@Req() req) {
    try {
      const result = await this.customerService.getCustomerStatistics(req.user);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-customer-deposit-satistic')
  async GetCustomerDepositStatistic() {
    try {
      const result = await this.customerService.calculateCustomerStatistics();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SALE)
  @Patch('update-info-customer')
  async UpdateInfoCustomer(@Body() body: CreateCustomerDto[], @Req() req) {
    try {
      const { user_code, role } = req.user;
      const result = await this.customerService.UpdateInfoCustomer(
        body,
        user_code,
        role,
      );
      return new ResponseData<string>(
        'Cập nhật khách hàng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-customer/:id')
  async UpdateCustomer(
    @Body() body: CreateCustomerDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.customerService.updateCustomer(id, body);
      return new ResponseData<string>(
        'Cập nhật thông tin khách hàng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('pass-customer')
  async passCustomer(
    @Body() body: { id: number; saler: string }[],
    @Req() req,
  ) {
    try {
      const { user_code, role } = req.user;
      const result = await this.customerService.passCustomer(
        body,
        user_code,
        role,
      );
      return new ResponseData<string>(
        'Chuyển khách hàng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-customers/:id')
  @UseInterceptors(NoFilesInterceptor())
  async deleteCustomers(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.customerService.DeleteCustomer(id);
      return new ResponseData<String>(
        'Xóa Customer thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list_srouce')
  async GetListSrouce() {
    try {
      const result = await this.customerService.getListSrouce();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-list-saler')
  async GetListSourceSaler() {
    try {
      const result = await this.customerService.getListSrouceSaler();
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('revoke-customer/:id')
  async revokeCustomer(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.customerService.revokeCustomer(id);
      return new ResponseData<String>(
        'Thu hồi khách hàng từ saler thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Customers>(null, HttpStatus.ERROR, error.message);
    }
  }
}
