import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance_code } from 'src/typeorm/entities/Attendances';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Customers } from 'src/typeorm/entities/Customers';
import { ResponsibilityIndex } from 'src/typeorm/entities/Responsibility_Index';
import { Salary } from 'src/typeorm/entities/salary';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { Statistics } from 'src/typeorm/entities/statistics';
import { UserProgress } from 'src/typeorm/entities/userProgress';
import { Users } from 'src/typeorm/entities/users';
import { Video } from 'src/typeorm/entities/videoYtb';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { Between, In, Not, Repository } from 'typeorm';
import { createResponsibility } from './dto/createResponsibility.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticRepository: Repository<Statistics>,
    @InjectRepository(Commissions)
    private commissionRepository: Repository<Commissions>,
    @InjectRepository(Attendance_code)
    private attendanceRepository: Repository<Attendance_code>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(ResponsibilityIndex)
    private responsibilityRepository: Repository<ResponsibilityIndex>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,
    @InjectRepository(SalaryBase)
    private salaryBaseRepository: Repository<SalaryBase>,
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>,
  ) {}

  @Cron('0 0 23 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCron() {
    console.log('tính lương');
    await this.calculateSalaries();
    console.log('kết thúc tính lương');
  }

  async getMonthRange(): Promise<{ startOfMonth: Date; endOfMonth: Date }> {
    const currentDate = new Date();
    const targetMonth = currentDate.getMonth() + 1;
    const targetYear = currentDate.getFullYear();
    return {
      startOfMonth: new Date(targetYear, targetMonth - 1, 1),
      endOfMonth: new Date(targetYear, targetMonth, 0),
    };
  }

  //chi so kpi phong kinh doanh
  async kpi_index_business() {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    let query = this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('Users', 'user', 'user.user_code = commission.user_manager')
      .select('commission.user_manager', 'user_manager')
      .addSelect('user.id', 'user_id')
      .addSelect(
        'CASE WHEN (SUM(commission.profit) / 10) >= 80 THEN 1 ELSE 0 END',
        'kpi_status',
      )
      .where('commission.create_at BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      });

    const result = await query
      .groupBy('commission.user_manager')
      .addGroupBy('user.id')
      .getRawMany();

    return result;
  }
  // chỉ số học tập
  async calculateVideoCompletionStatus() {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    // Truy vấn để lấy tổng số video trong tháng
    const totalVideosQuery = this.videoRepository
      .createQueryBuilder('video')
      .where('video.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      })
      .getCount();

    // Truy vấn để lấy số video đã xem của mỗi người dùng
    let userProgressQuery = this.userProgressRepository
      .createQueryBuilder('userProgress')
      .leftJoinAndSelect('userProgress.user', 'user')
      .leftJoinAndSelect('userProgress.lastWatchedVideo', 'video')
      .select('user.user_code', 'user_code')
      .addSelect(
        'COUNT(DISTINCT userProgress.lastWatchedVideo)',
        'watched_videos',
      )
      .where('userProgress.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      })
      .groupBy('user.user_code');

    const [totalVideos, userProgress] = await Promise.all([
      totalVideosQuery,
      userProgressQuery.getRawMany(),
    ]);

    // Tính toán trạng thái hoàn thành
    const result = userProgress.map((progress) => ({
      user_code: progress.user_code,
      completion_status: progress.watched_videos >= totalVideos ? 1 : 0,
    }));

    return result;
  }

  // chỉ số kpi phòng hành chính
  async getRecruitersKPI() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const recruiters = await this.userRepository
      .createQueryBuilder('recruiter')
      .leftJoinAndSelect('recruiter.department', 'department')
      .where('department.code = :departmentCode', {
        departmentCode: 'PHONG_HANH_CHINH',
      })
      .getMany();

    const result = [];

    for (const recruiter of recruiters) {
      const recruitedCount = await this.userRepository
        .createQueryBuilder('User')
        .leftJoin(
          'attendance_code',
          'attendance',
          'attendance.attendance_code = User.attendance_code',
        )
        .where('User.recuiter_code = :recruiterCode', {
          recruiterCode: recruiter.user_code,
        })
        .andWhere(
          'attendance.create_at BETWEEN :startOfMonth AND :endOfMonth',
          { startOfMonth, endOfMonth },
        )
        .groupBy('User.id')
        .having('COUNT(DISTINCT attendance.create_at) >= 7')
        .getCount();

      result.push({
        user_id: recruiter.id,
        kpi_status: recruitedCount >= 6 ? 1 : 0,
      });
    }

    return result;
  }

  //chỉ số kpi maketing
  async kpi_index_Maketin() {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();
    let query = this.customersRepository
      .createQueryBuilder('customers')
      .leftJoin('Users', 'user', 'user.user_code = customers.maketer')
      .select('customers.maketer', 'maketer')
      //.addSelect("user.id", "user_id")
      .addSelect(
        'CASE WHEN COUNT(customers.maketer) >= 5 THEN 1 ELSE 0 END',
        'kpi_status',
      )
      .where('customers.create_at BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      });
    const result = await query.groupBy('customers.maketer').getRawMany();

    return result;
  }

  //chỉ số trách nhiệm
  async responsibilityIndex() {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    // Fetch all responsibilities in the given date range
    const responsibilities = await this.responsibilityRepository
      .createQueryBuilder('responsibility')
      .select(['responsibility.userId', 'responsibility.point'])
      .where('responsibility.create_at BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      })
      .getMany();

    // Iterate over the results and calculate the sum of points for each user
    const result = responsibilities.map((responsibility) => {
      // Convert point strings to numbers and sum them
      const totalPoints = responsibility.point
        .map((pointStr) => Number(pointStr)) // Convert each string to a number
        .reduce((sum, current) => sum + current, 0); // Sum the numbers

      // Determine responsibility_status based on whether the sum is greater than 85
      const responsibility_status = totalPoints >= 85 ? 1 : 0;

      return {
        user_id: responsibility.userId,
        responsibility_status: responsibility_status,
      };
    });

    return result;
  }

  // chỉ số chuyên cần
  async attendance_index() {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    const result = await this.attendanceRepository.query(
      `
      SELECT
        ac.attendance_code,
        CASE
          WHEN COUNT(DISTINCT CASE 
            WHEN ac.time NOT IN ('V', 'Off')
            THEN ac.time 
          END) >= 21 THEN TRUE
          ELSE FALSE
        END as attendance_status
      FROM
        attendance_code ac
      LEFT JOIN
        users a ON ac.attendance_code = a.attendance_code
      WHERE
        ac.create_at BETWEEN ? AND ?
      GROUP BY
        ac.attendance_code
    `,
      [startOfMonth, endOfMonth],
    );

    return result;
  }

  //đánh giá chỉ số lợi nhuân và chỉ số đầu tư
  async updateIndexInvestment(
    userId: number,
    profitIndex: boolean,
    signalIndex: boolean,
  ): Promise<void> {
    const updateInvestment = await this.statisticRepository.findOne({
      where: { userId },
    });

    if (!updateInvestment) {
      throw new Error('User id không tồn tại');
    }

    await this.statisticRepository.update(userId, {
      profitIndex: profitIndex ? true : false,
      signal: signalIndex ? true : false,
    });
  }

  async getStatisticBusiness(): Promise<Set<{ statistic: Statistics }>> {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    const [
      attendance,
      kpi_business,
      response_index,
      study_index,
      recruiter_kpi_index,
      maketing_kpi_index,
      users,
    ] = await Promise.all([
      this.attendance_index(),
      this.kpi_index_business(),
      this.responsibilityIndex(),
      this.calculateVideoCompletionStatus(),
      this.getRecruitersKPI(),
      this.kpi_index_Maketin(),
      this.userRepository.find({
        where: {
          delete_at: false,
          status: StatusUser.ACTIVE,
        },
        relations: ['department'],
      }),
    ]);

    const results = await Promise.all(
      users.map(async (user) => {
        let statistic = await this.statisticRepository.findOne({
          where: {
            userId: user.id,
            create_at: Between(startOfMonth, endOfMonth),
          },
        });
        if (!statistic) {
          statistic = new Statistics();
          statistic.create_at = new Date();
        }

        const userAttendance = attendance.find(
          (s) => s.attendance_code === user.attendance_code,
        );
        const userKpiBusiness = kpi_business.find((k) => k.user_id === user.id);
        const userResponsibility = response_index.find(
          (k) => k.user_id === user.id,
        );
        const userStudyIndex = study_index.find(
          (k) => k.user_code === user.user_code,
        );
        const userRecruiterKpiIndex = recruiter_kpi_index.find(
          (k) => k.user_id === user.id,
        );
        const userMaketing = maketing_kpi_index.find(
          (k) => k.maketer === user.user_code,
        );
        const kpi_total = {
          ...userKpiBusiness,
          ...userRecruiterKpiIndex,
          ...userMaketing,
        };

        statistic.userId = user.id;
        statistic.department = user.department?.code ?? null;
        statistic.attendance = Number(userAttendance?.attendance_status) === 1;
        statistic.kpi = Number(kpi_total?.kpi_status) === 1;
        statistic.responsibility =
          Number(userResponsibility?.responsibility_status) === 1;
        statistic.edu = Number(userStudyIndex?.completion_status) === 1;
        statistic.update_at = new Date();

        await this.statisticRepository.save(statistic);
        return { statistic };
      }),
    );

    return new Set(
      results.filter((result) => result.statistic.userId !== null),
    );
  }

  //lấy thông tin lương user
  async calculateSalaries(): Promise<Salary[]> {
    await this.getStatisticBusiness();
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    // Lấy tất cả người dùng active
    const allUsers = await this.userRepository.find({
      where: { delete_at: false, status: StatusUser.ACTIVE },
      relations: ['department'],
    });

    const allStatistics = await this.statisticRepository
      .createQueryBuilder('statistic')
      .where('statistic.create_at BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      })
      .getMany();

    const allSalaryBases = await this.salaryBaseRepository.find();
    const salaryBaseMap = new Map(
      allSalaryBases.map((sb) => [sb.department_code, sb]),
    );

    const statisticsMap = new Map(
      allStatistics.map((stat) => [stat.userId, stat]),
    );

    const salaryResults: Salary[] = [];

    for (const user of allUsers) {
      const departmentCode = user.department?.code;
      const salaryBase = salaryBaseMap.get(departmentCode);
      const statistic = statisticsMap.get(user.id);

      if (!salaryBase) {
        console.log(
          `Không tìm thấy mức lương cơ bản cho phòng ban ${departmentCode}`,
        );
        continue;
      }

      let salaryMultiplier = 0;

      if (statistic) {
        switch (departmentCode) {
          case 'PHONG_KINH_DOANH':
            salaryMultiplier += statistic.kpi ? 0.25 : 0;
            salaryMultiplier += statistic.edu ? 0.25 : 0;
            salaryMultiplier += statistic.responsibility ? 0.25 : 0;
            salaryMultiplier += statistic.attendance ? 0.25 : 0;
            break;
          case 'PHONG_HANH_CHINH':
            salaryMultiplier += statistic.kpi ? 0.33 : 0;
            salaryMultiplier += statistic.responsibility ? 0.33 : 0;
            salaryMultiplier += statistic.attendance ? 0.34 : 0;
            break;
          case 'PHONG_DAU_TU':
            salaryMultiplier += statistic.profitIndex ? 0.25 : 0;
            salaryMultiplier += statistic.signal ? 0.25 : 0;
            salaryMultiplier += statistic.responsibility ? 0.25 : 0;
            salaryMultiplier += statistic.attendance ? 0.25 : 0;
            break;
          case 'PHONG_MARKETING':
            salaryMultiplier += statistic.kpi ? 0.33 : 0;
            salaryMultiplier += statistic.responsibility ? 0.33 : 0;
            salaryMultiplier += statistic.attendance ? 0.34 : 0;
            break;
          default:
            continue;
        }
      }

      // Kiểm tra xem đã có bản ghi lương cho user này trong tháng/năm đó chưa
      let salary = await this.salaryRepository.findOne({
        where: {
          userId: user.id,
          create_at: Between(startOfMonth, endOfMonth),
        },
      });

      if (!salary) {
        // Nếu chưa có, tạo mới bản ghi
        salary = new Salary();
        salary.userId = user.id;
        salary.create_at = new Date();
        salary.extra_salary = 0; // Giá trị mặc định cho extra_salary
      }

      let calculatedSalary: number;

      if (departmentCode === 'PHONG_MARKETING') {
        calculatedSalary =
          (salaryBase.salary_base + salary.extra_salary) * salaryMultiplier;
      } else {
        calculatedSalary = salaryBase.salary_base * salaryMultiplier;
      }

      // Cập nhật lại bản ghi lương
      salary.salary_base = calculatedSalary;
      salary.update_at = new Date();

      salaryResults.push(salary);
    }

    // Lưu tất cả kết quả tính lương vào database
    await this.salaryRepository.save(salaryResults);

    return salaryResults;
  }

  async createResponsibility(
    data: createResponsibility,
    managerId: number,
  ): Promise<void> {
    const check = await this.responsibilityRepository.save({
      ...data,
      managerId: managerId,
    });
  }

  async getResponsibilityId(id: number): Promise<ResponsibilityIndex> {
    const selectUserFields = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
      phone: true,
      role: true,
      manager: true,
      date_of_birth: true,
      attendance_code: true,
      cccd_front: true,
      cccd_back: true,
      avatar: true,
      status: true,
    };

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

    return await this.responsibilityRepository.findOne({
      where: {
        userId: id,
        create_at: Between(startOfMonth, endOfMonth), // Assuming `createdAt` is the field you use to track record creation time
      },
      relations: ['user', 'manager'],
      select: {
        user: { ...selectUserFields },
        manager: { ...selectUserFields },
      },
      order: {
        create_at: 'DESC', // Assuming you want the latest record
      },
    });
  }

  async getResponsibilityById(id: number): Promise<ResponsibilityIndex> {
    const selectUserFields = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
      phone: true,
      role: true,
      manager: true,
      date_of_birth: true,
      attendance_code: true,
      cccd_front: true,
      cccd_back: true,
      avatar: true,
      status: true,
    };

    return await this.responsibilityRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'manager'],
      select: {
        user: { ...selectUserFields },
        manager: { ...selectUserFields },
      },
    });
  }

  async getAllResponsibilityUser(id: number): Promise<ResponsibilityIndex[]> {
    const selectUserFields = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
      phone: true,
      role: true,
      manager: true,
      date_of_birth: true,
      attendance_code: true,
      cccd_front: true,
      cccd_back: true,
      avatar: true,
      status: true,
    };

    return await this.responsibilityRepository.find({
      where: {
        userId: id,
      },
      relations: ['user', 'manager'],
      select: {
        user: { ...selectUserFields },
        manager: { ...selectUserFields },
      },
      order: {
        create_at: 'DESC',
      },
    });
  }

  //===========================================================================================================

  //chi so kpi phong kinh doanh
  async kpi_index_businessUser(user_code: string, startDate?: Date, endDate?: Date) {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    let query = this.commissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.profit) / 10', 'kpi_status')
      .where('commission.create_at BETWEEN :startDate AND :endDate', {
        startDate: startDate ?? startOfMonth,
        endDate: endDate ?? endOfMonth,
      })
      .andWhere('commission.user_manager = :user_code', { user_code }); // Chỉ lọc cho user_code cụ thể

    const result = await query.groupBy('commission.user_manager').getRawOne(); // Chỉ lấy một kết quả cho user_code cụ thể

    return result;
  }
  // chi so hoc tap
  async calculateVideoCompletionStatusUser(user_code: string, startDate?: Date, endDate?: Date) {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    // Truy vấn để lấy tổng số video trong tháng
    const totalVideosQuery = this.videoRepository
      .createQueryBuilder('video')
      .where('video.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startDate ?? startOfMonth,
        endDate: endDate ?? endOfMonth,
      })
      .getCount();

    // Truy vấn để lấy số video đã xem của người dùng với user_code cụ thể
    try {
      let userProgressQuery = this.userProgressRepository
        .createQueryBuilder('userProgress')
        .leftJoinAndSelect('userProgress.user', 'user')
        .leftJoinAndSelect('userProgress.lastWatchedVideo', 'video')
        .select('COUNT(DISTINCT userProgress.lastWatchedVideo)', 'watched_videos')
        .where('userProgress.createdAt BETWEEN :startDate AND :endDate', {
          startDate: startDate ?? startOfMonth,
          endDate: endDate ?? endOfMonth,
        })
        .andWhere('user.user_code = :user_code', { user_code }) // Chỉ lọc user_code cụ thể
        .groupBy('user.user_code');

      // Truy vấn này chỉ trả về dữ liệu cho user_code được truyền vào
      const [userProgress] = await Promise.all([
        userProgressQuery.getRawOne(), // Sử dụng getRawOne để chỉ lấy một kết quả cho user_code cụ thể
      ]);

      return userProgress.watched_videos;
    } catch (error) {
      return 0;
    }
  }

  // chỉ số kpi phòng hành chính
  async getRecruitersKPIUser(user_code: string, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Truy vấn để lấy thông tin của recruiter theo user_code
    const recruiter = await this.userRepository
      .createQueryBuilder('recruiter')
      .leftJoinAndSelect('recruiter.department', 'department')
      .where('recruiter.user_code = :user_code', { user_code })
      .andWhere('department.code = :departmentCode', {
        departmentCode: 'PHONG_HANH_CHINH',
      })
      .getOne();

    // Kiểm tra xem recruiter có tồn tại hay không
    if (!recruiter) {
      throw new Error('Recruiter not found or not part of PHONG_HANH_CHINH');
    }

    // Truy vấn để lấy số lượng nhân viên đã tuyển bởi recruiter này
    const recruitedCount = await this.userRepository
      .createQueryBuilder('User')
      .leftJoin(
        'attendance_code',
        'attendance',
        'attendance.attendance_code = User.attendance_code',
      )
      .where('User.recuiter_code = :recruiterCode', {
        recruiterCode: recruiter.user_code,
      })
      .andWhere('attendance.create_at BETWEEN :startDate AND :endDate', {
        startDate: startDate ?? startOfMonth,
        endDate: endDate ?? endOfMonth,
      })
      .groupBy('User.id')
      .having('COUNT(DISTINCT attendance.create_at) >= 7')
      .getCount();

    // Trả về kết quả KPI cho recruiter đó
    return recruitedCount;
  }

  //chỉ số kpi maketing
  async kpi_index_MaketinUser(user_code: string, startDate?: Date, endDate?: Date) {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    let query = this.customersRepository
      .createQueryBuilder('customers')
      .select('COUNT(customers.maketer)', 'kpi_status')
      .where('customers.create_at BETWEEN :startDate AND :endDate', {
        startDate: startDate ?? startOfMonth,
        endDate: endDate ?? endOfMonth,
      })
      .andWhere('customers.maketer = :user_code', { user_code });

    const result = await query.groupBy('customers.maketer').getRawMany();

    return result;
  }

  //chỉ số trách nhiệm
  async responsibilityIndexUser(user_code: string, startDate?: Date, endDate?: Date) {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    const result = await this.responsibilityRepository.findOne({
      relations: ['user'],
      where: {
        user: {
          user_code: user_code,
        },
        create_at: Between(startDate ?? startOfMonth, endDate ?? endOfMonth),
      },
    });
    let totalPoints = 0;
    totalPoints = result?.point
      .map((pointStr) => Number(pointStr)) // Convert each string to a number
      .reduce((sum, current) => sum + current, 0); // Sum the numbers
    return totalPoints;
  }

  // chỉ số chuyên cần
  async attendance_indexUser(user_code: string, startDate?: Date, endDate?: Date) {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    const result = await this.attendanceRepository.query(
      `
      SELECT
        COUNT(DISTINCT CASE 
          WHEN ac.time NOT IN ('V', 'Off') 
          THEN ac.create_at
          END) as attendance_days_count
      FROM
        attendance_code ac
      LEFT JOIN
        users a ON ac.attendance_code = a.attendance_code
      WHERE
        ac.create_at BETWEEN ? AND ?
        AND a.user_code = ?
      GROUP BY
        ac.attendance_code
    `,
      [startDate ?? startOfMonth, endDate ?? endOfMonth, user_code],
    );

    if (!result || result.length === 0) {
      return null; // User not found or no attendance records
    }

    return result[0].attendance_days_count;
  }

  async getInfoStatistic(user_code: string, startDate?: Date, endDate?: Date): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_code },
      relations: ['department'],
    });

    const commonStats = {
      responsibility: await this.responsibilityIndexUser(user_code, startDate, endDate),
      attendance: await this.attendance_indexUser(user_code, startDate, endDate),
    };
    const departmentStats = {
      PHONG_KINH_DOANH: async () => ({
        ...commonStats,
        kpi: await this.kpi_index_businessUser(user_code , startDate, endDate),
        study: await this.calculateVideoCompletionStatusUser(user_code, startDate, endDate),
      }),
      PHONG_MARKETING: async () => ({
        ...commonStats,
        kpi: await this.kpi_index_MaketinUser(user_code, startDate, endDate),
      }),
      PHONG_HANH_CHINH: async () => ({
        ...commonStats,
        kpi: await this.getRecruitersKPIUser(user_code, startDate, endDate),
      }),
      PHONG_DAU_TU: async () => commonStats,
    };

    const getDepartmentStats =
      (await departmentStats[user.department.code]) || (() => ({}));
    return getDepartmentStats();
  }
}
