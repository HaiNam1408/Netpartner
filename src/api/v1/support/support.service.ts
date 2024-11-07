import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Support } from 'src/typeorm/entities/support';
import { In, Or, Repository } from 'typeorm';
import { CreateSupportDto } from './dto/createSupport.dto';
import { Role } from 'src/typeorm/enum/role.enum';
import { Users } from 'src/typeorm/entities/users';
import {
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { typeSupport } from 'src/typeorm/enum/typeSupport.enum';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/createNotification.dto';
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private supportRepository: Repository<Support>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private recuiser: GlobalRecusive,
    private notificationService: NotificationsService,
  ) {}

  async createSupport(data: CreateSupportDto, authorId: number) {
    const result = this.supportRepository.save({
      ...data,
      attachment: data.file,
      authorId,
    });
    const ceo = await this.userRepository.findOne({
      where: { user_code: 'NET0000' },
    });
    const newData = {
      title: data.title,
      content: data.content,
      cover:data.cover,
      userIds: [ceo.id],
    };
    this.notificationService.createNotification(newData, authorId);
    return result;
  }

  async getAllRequest(
    limit: number,
    page: number,
    type: typeSupport,
    role: Role,
    id: number,
    user_code: string,
  ): Promise<PaginatedResult<Support>> {
    try {
      const queryBuilder = this.supportRepository
        .createQueryBuilder('support')
        .leftJoinAndSelect('support.user', 'user')
        .where('support.type = :type', { type })
        .orderBy('support.create_at', 'DESC');

      this.applyAdditionalFilters(queryBuilder, type, role, id, user_code);

      const total = await queryBuilder.getCount();
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const data = await queryBuilder
        .skip(skip)
        .take(limit)
        .select(this.getSelectFields())
        .getMany();

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private applyAdditionalFilters(
    queryBuilder: any,
    type: typeSupport,
    role: Role,
    id: number,
    user_code: string,
  ): void {
    if (role === Role.CEO || id) {
      if (type === typeSupport.GOP_Y || type === typeSupport.SU_GIA_HOA_BINH) {
        queryBuilder.andWhere(
          '(user.role = :ceoRole OR support.authorId = :id)',
          { ceoRole: Role.CEO, id },
        );
        return;
      }
    }

    if (
      [Role.CEO, Role.LEADER_EMPLOYEE, Role.ACCOUNTANT].includes(role) &&
      type === typeSupport.HO_TRO
    ) {
      return; // No additional filters needed
    }

    queryBuilder.andWhere(
      '(support.authorId = :id OR user.manager = :user_code)',
      { id, user_code },
    );
  }

  private getSelectFields(): string[] {
    return [
      'support.id',
      'support.content',
      'support.type',
      'support.status',
      'support.attachment',
      'support.create_at',
      'user.id',
      'user.user_code',
      'user.email',
      'user.fullname',
      'user.phone',
      'user.role',
      'user.manager',
      'user.accountBank',
      'user.CV',
      'user.duty',
      'user.gender',
      'user.date_of_birth',
      'user.attendance_code',
      'user.cccd_front',
      'user.cccd_back',
      'user.avatar',
    ];
  }

  private handleError(error: Error): never {
    console.error(`Error fetching requests: ${error.message}`);
    throw new Error('Failed to fetch requests. Please try again later.');
  }

  async getRequesId(id: number) {
    const result = await this.supportRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        type: true,
        attachment: true,
        status: true,
        user: {
          id: true,
          user_code: true,
          email: true,
          fullname: true,
          phone: true,
          role: true,
          manager: true,
          accountBank: true,
          CV: true,
          duty: true,
          gender: true,
          date_of_birth: true,
          attendance_code: true,
          cccd_front: true,
          cccd_back: true,
          avatar: true,
          delete_at: true,
          status: true,
        },
      },
    });
    return result;
  }

  async updateStatusRequest(
    status: string,
    id: number,
    user_code: string,
    role: any,
  ) {
    const support = await this.supportRepository.findOne({ where: { id } });
    Object.assign(support, { status: status });
    await this.supportRepository.save(support);
  }

  async deleteSupport(id: number): Promise<void> {
    await this.supportRepository.delete(id);
  }
}
