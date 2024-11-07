import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOnline } from 'src/typeorm/entities/UserOnline';
import { Users } from 'src/typeorm/entities/users';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UserOnlineService {
  constructor(
    @InjectRepository(UserOnline)
    private userOnlineRepository: Repository<UserOnline>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUserOnline(userId: number, time: number): Promise<void> {
    // Kiểm tra xem user có tồn tại không
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Tìm bản ghi UserOnline cho tháng hiện tại
    let userOnline = await this.userOnlineRepository.findOne({
      where: {
        userId: userId,
        create_at: MoreThanOrEqual(firstDayOfMonth),
      },
    });

    if (userOnline) {
      // Nếu đã có bản ghi cho tháng này, cập nhật thời gian
      userOnline.time += time;
      userOnline.update_at = new Date();
    } else {
      // Nếu chưa có bản ghi cho tháng này, tạo mới
      userOnline = this.userOnlineRepository.create({
        userId: userId,
        time: time,
        user: user,
        create_at: firstDayOfMonth,
        update_at: new Date(),
      });
    }

    // Lưu bản ghi
    await this.userOnlineRepository.save(userOnline);
  }

  async getAllOnlineOfUserForYear(userId: number, startDate?: Date, endDate?: Date): Promise<UserOnline[]> {
    const year = new Date().getFullYear();
    const startOfYear = startDate ?? new Date(year, 0, 1);
    const endOfYear = endDate ?? new Date(year, 11, 31, 23, 59, 59, 999);

    return await this.userOnlineRepository.find({
      where: {
        userId,
        create_at: Between(startOfYear, endOfYear),
      },
      order:{
        create_at:'asc'
      }
    });
  }

  async getOnlineUser(userId: number): Promise<UserOnline[]> {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return await this.userOnlineRepository.find({
      where: {
        userId,
        create_at: Between(startOfYear, endOfYear),
      },
      order:{
        create_at:'asc'
      }
    });
  }
}
