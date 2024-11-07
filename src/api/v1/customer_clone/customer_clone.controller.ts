import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerCloneService } from './customer_clone.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCustomerCloneDto } from './dto/createCustomers.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CustomerClone } from 'src/typeorm/entities/customer_clone.entity';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { GetPaginationCustomerClone } from './dto/getPagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportFileDto } from './dto/importFileCustomer.dto';

@ApiBearerAuth()
@ApiTags('customer-clone')
@Controller('customer-clone')
export class CustomerCloneController {
  constructor(private readonly customerService: CustomerCloneService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createCustomerClone(
    @Body() body: CreateCustomerCloneDto[],
    @Req() req,
  ) {
    try {
      const { user_code } = req.user;
      await this.customerService.createCustomer(body, user_code);
      return new ResponseData<String>(
        'Tạo Customer thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<CustomerClone>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-customer-clone')
  async getAllCustomerClone(
    @Query() { limit, page }: GetPaginationCustomerClone,
    @Req() req,
  ) {
    try {
      const { user_code } = req.user;
      const result = await this.customerService.getAllCustomer(
        user_code,
        limit,
        page,
      );
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<CustomerClone>(
        null,
        HttpStatus.ERROR,
        error.message,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-customer/:id')
  async UpdateCustomer(
    @Body() body: CreateCustomerCloneDto,
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
      return new ResponseData<CustomerClone>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('accept-customer/:id')
  async AcceptCustomer(
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.customerService.acceptCustomer(id);
      return new ResponseData<string>(
        'Duyệt khách hàng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<CustomerClone>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('import-customer-by-csv')
  @UseInterceptors(FileInterceptor("file"))
  async importCustomerByCsv(
    @Req() req,
    @Body() data: ImportFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: "text/csv" })],
      })
    )
    file: Express.Multer.File
  ){
    try {
      if (!file) {
        throw new HttpException("CSV file is required", HttpStatus.BAD_REQUEST);
      }
  
      const csvBuffer = file.buffer;
      const accountId = req.user.id;
      const products = await this.customerService.createMultipleProductsFromCSV(
        csvBuffer,
        accountId
      );
      return new ResponseData<string>(
        'Nhập khách hàng thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<CustomerClone>(null, HttpStatus.ERROR, error.message);
    }
   
  }


}
