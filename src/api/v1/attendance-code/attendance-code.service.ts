import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance_code } from 'src/typeorm/entities/Attendances';
import { Between, Repository } from 'typeorm';
import { CreateAttendanceCodeDto } from './dto/createAttendance.dto';
import { Users } from 'src/typeorm/entities/users';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { Attendance_info } from 'src/typeorm/entities/attendancesInfo';

@Injectable()
export class AttendanceCodeService {
  constructor(
    @InjectRepository(Attendance_code)
    private attendanceRepository: Repository<Attendance_code>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Attendance_info)
    private attendanceInfoRepository: Repository<Attendance_info>,
  ) {}

  async createAttendance(data: any): Promise<any> {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const attendanceUsers: any[] = [];
    const attendanceInfoUpdates: any[] = [];

    for (const item of data) {
      const employeeID = item.employeeID;

      // Xử lý thông tin điểm danh cho từng ngày
      item.times.forEach((attendance: any) => {
        if (attendance.time) {
          attendanceUsers.push({
            attendance_code: employeeID,
            day: attendance.day,
            time: attendance.time,
          });
        }
      });

      // Kiểm tra xem đã có record nào trong tháng cho employeeID chưa
      const existingInfo = await this.attendanceInfoRepository.findOne({
        where: {
          attendance_code: employeeID,
          create_at: Between(
            new Date(currentYear, currentMonth - 1, 1),
            new Date(currentYear, currentMonth, 0, 23, 59, 59)
          ),
        },
      });

      // Dữ liệu thông tin của nhân viên
      const infoData = {
        stt: Number(item.inf.STT) || 0,
        employeeName: item.inf.employeeName,
        dayWorkNormal: Number(item.inf.dayWorkNormal) || 0,
        dayWorkOverTime: Number(item.inf.dayWorkOverTime) || 0,
        hourWorkNormal: Number(item.inf.hourWorkNormal) || 0,
        hourWorkOverTime: Number(item.inf.hourWorkOverTime) || 0,
        countDelay: Number(item.inf.countDelay) || 0,
        minutesDelayTime: Number(item.inf.minutesDelayTime) || 0,
        countEarly: Number(item.inf.countEarly) || 0,
        minutesEarlyTime: Number(item.inf.minutesEarlyTime) || 0,
        tc1: Number(item.inf.TC1) || 0,
        tc2: Number(item.inf.TC2) || 0,
        tc3: Number(item.inf.TC3) || 0,
        absenceWithoutPermission: Number(item.inf.absenceWithoutPermission) || 0,
        om: Number(item.inf.OM) || 0,
        ts: Number(item.inf.TS) || 0,
        r: Number(item.inf.R) || 0,
      };

      if (existingInfo) {
        // Cập nhật lại record đã tồn tại
        await this.attendanceInfoRepository.update(existingInfo.id, infoData);
      } else {
        // Tạo mới nếu chưa tồn tại
        attendanceInfoUpdates.push({
          attendance_code: employeeID,
          ...infoData,
          create_at: new Date(),
        });
      }
    }

    // Thêm các record vào attendances
    if (attendanceUsers.length > 0) {
      await this.attendanceRepository.insert(attendanceUsers);
    }

    // Thêm mới các record vào attendanceInfo nếu có
    if (attendanceInfoUpdates.length > 0) {
      await this.attendanceInfoRepository.insert(attendanceInfoUpdates);
    }

    return { message: 'Attendance data processed successfully.' };
  }


  async getAttendanceGroupedByCode(): Promise<
    { attendance_code: string; count: number }[]
  > {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const result = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('attendance.attendance_code', 'attendance_code')
      .addSelect('COUNT(*)', 'count')
      .where('attendance.create_at >= :startDate', { startDate: startOfMonth })
      .andWhere('attendance.create_at < :endDate', { endDate: endOfMonth })
      .groupBy('attendance.attendance_code')
      .getRawMany();

    return result;
  }

  async getAttendance(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, status: StatusUser.ACTIVE, delete_at: false },
      select: [
        'user_code',
        'email',
        'fullname',
        'phone',
        'accountBank',
        'CV',
        'duty',
        'role',
        'manager',
        'gender',
        'date_of_birth',
        'attendance_code',
        'cccd_front',
        'cccd_back',
        'avatar',
        'status',
      ],
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const whereCondition: any = { attendance_code: user.attendance_code };

    if (startDate && endDate) {
      whereCondition.create_at = Between(startDate, endDate);
    }

    const attendances = await this.attendanceRepository.find({
      where: whereCondition,
      order: { day: 'ASC' },
    });

    const attendancesInfo = await this.attendanceInfoRepository.findOne({
      where: {
        attendance_code: user.attendance_code,
        create_at: (startDate && endDate) ? Between(startDate, endDate) : null,
      }
    }) 

    return {
      user,
      attendances,
      attendancesInfo
    };
  }
}
