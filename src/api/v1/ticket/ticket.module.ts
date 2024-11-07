import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from 'src/typeorm/entities/tickets';
import { ResponsesTicket } from 'src/typeorm/entities/responsesTicket';
import { BroadCastTicket } from 'src/typeorm/entities/boardCastTikect';
import { Department } from 'src/typeorm/entities/department';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets, ResponsesTicket, BroadCastTicket,Department,Users]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
