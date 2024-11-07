import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/typeorm/entities/Notifications';
import { In, Not, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { deleteFile, saveFile } from 'src/global/globalFile';
import { BroadCasts } from 'src/typeorm/entities/broadCasts';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { Department } from 'src/typeorm/entities/department';
import { Users } from 'src/typeorm/entities/users';
import { Role } from 'src/typeorm/enum/role.enum';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
    @InjectRepository(BroadCasts)
    private broadcastRepository: Repository<BroadCasts>,
    @InjectRepository(Department)
    private DepartmentRepository: Repository<Department>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createNotification(
    data: any,
    userId: number,
  ): Promise<void> {
    const result = await this.notificationRepository.save({
      ...data,
      userId,
    });
    if (result) {
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
          await this.broadcastRepository.save({
            notificationId: result.id,
            userId: user.id,
          });
        }
      } else if (data.userIds[0] !== 0) {
        for (let userId of data.userIds) {
          await this.broadcastRepository.save({
            notificationId: result.id,
            userId: userId,
          });
        }
      }
    }
  }
  async getNotificationSend(
    userId: number,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    const user = {
      id: true,
      user_code: true,
      email: true,
      duty: true,
      fullname: true,
      phone: true,
      accountBank: true,
      CV: true,
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
    const relations = ['user', 'broadCast', 'broadCast.user'];
    const select = {
      user: {
        ...user,
      },
      broadCast: {
        id: true,
        create_at: true,
        user: {
          ...user,
        },
      },
    };
    const where: Partial<any> = { userId };
    const orderBy = { create_at: 'DESC' };
    return PaginationService.paginate<Notifications>(
      this.notificationRepository,
      { page, limit },
      where,
      relations,
      select,
      orderBy,
    );
  }
  async getNotificationId(id: number): Promise<any> {
    const select = {
      id: true,
      user_code: true,
      email: true,
      duty: true,
      fullname: true,
      phone: true,
      accountBank: true,
      CV: true,
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
    return this.notificationRepository.findOne({
      where: {
        id: id,
      },
      relations: ['broadCast', 'broadCast.user'],
      select: {
        user: {
          ...select,
        },
        broadCast: {
          id: true,
          create_at: true,
          user: {
            ...select,
          },
        },
      },
    });
  }
  async reciveNotification(
    userId: number,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    const where = {
      userId: userId,
    };

    const orderBy = { create_at: 'DESC' };
    const relations = ['notification', 'notification.user', 'user'];
    const select = {
      id: true,
      read: true,
      create_at: true,
      userId: true,
      user: {
        id: true,
        user_code: true,
        email: true,
        duty: true,
        fullname: true,
        phone: true,
        accountBank: true,
        CV: true,
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
      },
      notification: {
        id: true,
        title: true,
        content: true,
        cover: true,
        create_at: true,
      },
    };

    return PaginationService.paginate(
      this.broadcastRepository,
      { page, limit },
      where,
      relations,
      select,
      orderBy,
    );
  }
  async updateNotificationStatus(
    userId: number,
    broadCastId: number,
  ): Promise<void> {
    const check = await this.broadcastRepository.findOne({
      where: {
        userId: userId,
        id: broadCastId,
        read: false,
      },
    });

    if (!check) throw new Error('Thông báo này bạn không thể đọc');

    check.read = true;
    await this.broadcastRepository.save(check);
  }

  async updateNotification(
    id: number,
    data: UpdateNotificationDto,
  ): Promise<Notifications> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) throw new HttpException('Thông báo không tồn tại', 404);

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        notification[key] = value;
      }
    }

    await this.broadcastRepository.update(
      { notificationId: id },
      { read: false },
    );

    return this.notificationRepository.save(notification);
  }

  async deleteNotification(id: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) throw new HttpException('Thông báo không tồn tại', 404);

    await this.broadcastRepository.delete({ notificationId: id });
    await this.notificationRepository.remove(notification);
  }
}
