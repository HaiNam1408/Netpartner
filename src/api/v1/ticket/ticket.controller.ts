import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/createTicket.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Tickets } from 'src/typeorm/entities/tickets';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { PaginationTicketDto } from './dto/paginationTicket.dto';
import { UpdateTicketDto } from './dto/updateTicket.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UpdateStatusTicketDto } from './dto/updateStatus.dto';
@ApiBearerAuth()
@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
    constructor(private ticketService : TicketService){}
    
    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-ticket')
    async createTicket(@Body() body:CreateTicketDto,@Req() req){
        try {
            const {id} = req.user;
            await this.ticketService.createTicket(body,id)
            return new ResponseData<String>("Tạo ticket thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @Get('get-all-ticket-user')
    async getAllTicket(@Query() {limit,page}:PaginationTicketDto, @Req() req){
        try {
            const {id} = req.user ;
            const result = await this.ticketService.getAllTicketUser(id,limit,page)
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @Get('get-ticket/:id')
    async getTicketId(@Param('id',ParseIntPipe) id:number,@Req() req){
        try {
            const userId = req.user.id;
            const result = await this.ticketService.getTicketId(id,userId)
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('response-ticket')
    async responseTicket(@Body() body:UpdateTicketDto,@Req() req){
        try {
            const {id} = req.user;
            const result = await this.ticketService.responseTicket(body,id)
            return new ResponseData<String>("Phản hồi ticket thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Patch('close-ticket/:id')
    async closeTicket(@Param('id',ParseIntPipe) idTicket:number,@Req() req){
        try {
            const {id} = req.user;
            const result = await this.ticketService.closeTicket(idTicket,id)
            return new ResponseData<String>("Close ticket thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @Delete('response-ticket/:id')
    async deleteTicket(@Param('id', ParseIntPipe) idTicket:number,@Req() req){
        try {
            const {id} = req.user;
            const result = await this.ticketService.deleteTicket(idTicket,id)
            return new ResponseData<String>("Xóa ticket thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Put('update-status-ticket/:id')
    async updateStatusTicket(@Param('id', ParseIntPipe) idTicket:number, @Body() {status}:UpdateStatusTicketDto){
        try {
            const result = await this.ticketService.updateStatusTicket(idTicket, status)
            return new ResponseData<String>("Cập nhật trạng thái ticket thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
          } catch (error) {
              return new ResponseData<Tickets>(null, HttpStatus.ERROR, error.message);
          }
    }
}
