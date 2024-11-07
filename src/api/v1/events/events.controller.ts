import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { CreateEventDto } from './dto/createEvent.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { EventTitleDto } from './dto/rangeEvent.dto';
import { Events } from 'src/typeorm/entities/events';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private EventService:EventsService){}
    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-event')
    async create(@Body() createBranchDto: CreateEventDto) {
      try {
        await this.EventService.createEvents(createBranchDto);
        return new ResponseData<String>("Tạo Event thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Event>(null, HttpStatus.ERROR, error.message);
      }
    }
  
    @UseGuards( AuthGuard )
    @Get('find-event-follow-range')
    async findAll(@Query(){start_at,end_at}:EventTitleDto) {
      try {
        const result = await this.EventService.findEventsFollowRange(start_at,end_at);
        return new ResponseData<Events[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Events>(null, HttpStatus.ERROR, error.message);
      }
  
    }
  
  
    @UseGuards(AuthGuard)
    @Delete('delete-event/:id')
    async removeEvent(@Param('id',ParseIntPipe) id: number) {
      try {
        await this.EventService.removeEvents(id);
        return new ResponseData<String>("Xoá thành công!", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
      } catch (error) {
          return new ResponseData<Event>(null, HttpStatus.ERROR, error.message);
      }
    }
}
