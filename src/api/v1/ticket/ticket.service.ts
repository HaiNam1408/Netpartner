import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from 'src/typeorm/entities/tickets';
import { In, LessThan, Not, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/createTicket.dto';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';
import { UpdateTicketDto } from './dto/updateTicket.dto';
import { ResponsesTicket } from 'src/typeorm/entities/responsesTicket';
import { Cron } from '@nestjs/schedule';
import { BroadCastTicket } from 'src/typeorm/entities/boardCastTikect';
import { Department } from 'src/typeorm/entities/department';
import { Users } from 'src/typeorm/entities/users';
import { Role } from 'src/typeorm/enum/role.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Tickets)
    private ticketRepository: Repository<Tickets>,
    @InjectRepository(ResponsesTicket)
    private responseTicketRepository: Repository<ResponsesTicket>,
    @InjectRepository(BroadCastTicket)
    private boardcastTicketRepository: Repository<BroadCastTicket>,
    @InjectRepository(Department)
    private DepartmentRepository: Repository<Department>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createTicket(data: CreateTicketDto, userId: number): Promise<Tickets> {
    const ticket = await this.ticketRepository.save({
      ...data,
      userId: userId,
    });

    if (data.departmentId) {
      const department = await this.DepartmentRepository.findOne({
        where: { id: data.departmentId },
        select: { code: true },
      });
      let eligibleUsers: { id: number }[] = [];

      switch (department.code) {
        case 'PHONG_CEO':
          eligibleUsers = await this.usersRepository.find({
            where: { departmentId: data.departmentId },
            select: { id: true },
          });
          break;
        case 'PHONG_HANH_CHINH':
          eligibleUsers = await this.usersRepository.find({
            where: {
              departmentId: data.departmentId,
            },
            select: { id: true },
          });
          break;
        case 'PHONG_DAU_TU':
          eligibleUsers = await this.usersRepository.find({
            where: {
              departmentId: data.departmentId,
            },
            select: { id: true },
          });
          break;
        case 'PHONG_KINH_DOANH':
          eligibleUsers = await this.usersRepository.find({
            where: {
              departmentId: data.departmentId,
            },
            select: { id: true },
          });
          break;
        case 'PHONG_MARKETING':
          eligibleUsers = await this.usersRepository.find({
            where: {
              departmentId: data.departmentId,
            },
            select: { id: true },
          });
          break;
        default:
          eligibleUsers = await this.usersRepository.find({
            where: { departmentId: data.departmentId },
            select: { id: true },
          });
          break;
      }
      for (const user of eligibleUsers) {
        await this.boardcastTicketRepository.save({
          ticketId: ticket.id,
          userId: user.id,
        });
      }
    } else {
      if (ticket) {
        await this.boardcastTicketRepository.save({
          ticketId: ticket.id,
          userId: data.reciverId,
          senderId: userId,
        });
      }
    }

    return ticket;
  }

  async getAllTicketUser(
    userId: number,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    const where = [
      {
        userId: userId,
      },
      {
        ticket: {
          userId: userId,
        },
      },
    ];

    const relations = ['user', 'ticket', 'ticket.user', 'ticket.response'];

    const info = {
      id: true,
      user_code: true,
      email: true,
      fullname: true,
      accountBank: true,
      CV: true,
      duty: true,
      phone: true,
      role: true,
      manager: true,
      gender: true,
      date_of_birth: true,
      attendance_code: true,
      cccd_front: true,
      cccd_back: true,
      avatar: true,
      delete_at: false,
      status: true,
    };

    const select = {
      user: { ...info },
      ticket: {
        id: true,
        title: true,
        content: true,
        status: true,
        user: { ...info },
        response: {
          id: true,
          ticketId: true,
          authorId: true,
          title: true,
          content: true,
        },
      },
    };

    const orderBy = { create_at: 'DESC' };

    return PaginationService.paginate<BroadCastTicket>(
      this.boardcastTicketRepository,
      { page, limit },
      where,
      relations,
      select,
      orderBy,
    );
  }

  async getTicketId(id: number, userId: number): Promise<any> {
    const relations = ['user', 'ticket', 'ticket.user', 'ticket.response'];

    const info = {
      id: true,
      user_code: true,
      email: true,
      fullname: true,
      accountBank: true,
      CV: true,
      duty: true,
      phone: true,
      role: true,
      manager: true,
      gender: true,
      date_of_birth: true,
      attendance_code: true,
      cccd_front: true,
      cccd_back: true,
      avatar: true,
      delete_at: false,
      status: true,
    };

    const select = {
      user: { ...info },
      ticket: {
        id: true,
        title: true,
        content: true,
        status: true,
        user: { ...info },
        response: {
          id: true,
          ticketId: true,
          authorId: true,
          title: true,
          content: true,
        },
      },
    };

    const broadcastTicket = await this.boardcastTicketRepository.findOne({
      where: { id: id, userId: userId },
    });

    if (broadcastTicket && !broadcastTicket.read) {
      broadcastTicket.read = true;
      await this.boardcastTicketRepository.save(broadcastTicket);
    }

    // Cập nhật điều kiện where để bao gồm người gửi và người nhận
    const result = await this.boardcastTicketRepository.findOne({
      relations,
      where: [
        { id: id, userId: userId },
        { id: id, ticket: { userId: userId } },
        { id: id },
      ],
      select,
    });

    return result;
  }

  async responseTicket(data: UpdateTicketDto, userId: number): Promise<void> {
    const checkTicket = await this.ticketRepository.findOne({
      where: { id: data.ticketId, close: false },
    });
    if (!checkTicket) {
      throw new Error('Ticket đã đóng bạn không thể phản hồi');
    }
    await this.responseTicketRepository.save({ ...data, authorId: userId });
  }

  async closeTicket(id: number, userId: number): Promise<void> {
    const check = await this.ticketRepository.findOne({
      where: {
        id: id,
        userId: userId,
        close: false,
      },
    });
    if (!check) throw new Error('Bạn không có quyền');
    check.close = true;
    await this.ticketRepository.save(check);
  }

  async updateStatusTicket(id: number, status: any): Promise<void> {
    const result = await this.ticketRepository.update(id, { status: status });
  }

  async deleteTicket(id: number, userId: number): Promise<void> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
      relations: ['response', 'broadCast'],
    });

    if (!ticket) throw new Error('Bạn không có quyền hoặc vé không tồn tại');

    // Delete related broadCastTickets first
    if (ticket.broadCast && ticket.broadCast.length > 0) {
      await this.boardcastTicketRepository.remove(ticket.broadCast);
    }

    // Delete the ticket response if it exists
    if (ticket.response) {
      await this.responseTicketRepository.remove(ticket.response);
    }

    // Now delete the ticket
    await this.ticketRepository.remove(ticket);
  }

  @Cron('0 0 * * *') // Chạy hàng ngày lúc 00:00
  async deleteAuto(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldTickets = await this.ticketRepository.find({
      where: {
        create_at: LessThan(thirtyDaysAgo),
      },
      relations: ['response', 'broadCast'],
    });

    if (oldTickets.length > 0) {
      await this.ticketRepository.remove(oldTickets);
      console.log(`Đã xóa ${oldTickets.length} ticket quá 30 ngày.`);
    }
  }
}
