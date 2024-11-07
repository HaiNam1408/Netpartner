import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { Salary } from 'src/typeorm/entities/salary';
import { Between, Like, Repository } from 'typeorm';
import { CreateSalaryBase } from './dto/createSalaryBase.dto';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { Customers } from 'src/typeorm/entities/Customers';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,

    @InjectRepository(SalaryBase)
    private salaryBaseRepository: Repository<SalaryBase>,
    @InjectRepository(Commissions)
    private comissionRepository: Repository<Commissions>,
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
  ) {}
  async getMonthRange(): Promise<{ startOfMonth: Date; endOfMonth: Date }> {
    const currentDate = new Date();
    const targetMonth = currentDate.getMonth() + 1;
    const targetYear = currentDate.getFullYear();
    return {
      startOfMonth: new Date(targetYear, targetMonth - 1, 1),
      endOfMonth: new Date(targetYear, targetMonth, 0),
    };
  }

  async createSalary(data: CreateSalaryBase): Promise<void> {
    // Kiểm tra xem đã tồn tại bản ghi với department_code này chưa
    const existingSalary = await this.salaryBaseRepository.findOne({
      where: { department_code: data.department_code },
    });
    if (existingSalary) {
      const salary = Object.assign(existingSalary, data);
      // Nếu đã tồn tại, cập nhật bản ghi
      await this.salaryBaseRepository.save(salary);
    } else {
      // Nếu chưa tồn tại, tạo mới bản ghi
      const newSalary = this.salaryBaseRepository.create(data);
      await this.salaryBaseRepository.save(newSalary);
    }
  }

  async getAllSalaryBase(): Promise<SalaryBase[]> {
    return await this.salaryBaseRepository.find();
  }

  async getSalaryBaseId(id: number): Promise<SalaryBase> {
    return await this.salaryBaseRepository.findOneBy({ id });
  }

  async getSalaryUsers(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
    },
  ): Promise<PaginatedResult<any>> {
    let where: any = {};
    if (options.keyword && options.keyword.trim() !== '') {
      const searchText = options.keyword.trim();
      where = [
        { userId: Like(`%${searchText}%`) },
        { salary_bonus: Like(`%${searchText}%`) },
      ];
    }
    //Xử lý lọc theo khoảng ngày
    if (options.dateRange && options.dateRange.length === 2) {
      const [startDate, endDate] = options.dateRange;
      where.create_at = Between(startDate, endDate);
    }
    const relations = ['user', 'user.department'];
    const order = { id: 'ASC' };
    const select = {
      id: true,
      salary_base: true,
      salary_bonus: true,
      extra_salary: true,
      create_at: true,
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
        department: {
          id: true,
          name: true,
        },
      },
    };
    return await PaginationService.paginate(
      this.salaryRepository,
      options,
      where,
      relations,
      select,
      order,
    );
  }
  async getSalaryUserId(userId: number, startDate?: Date, endDate?: Date): Promise<Salary> {
    let where: any = {
      userId: userId,
    };
    if (startDate && endDate) {
      where.create_at = Between(startDate, endDate);
    }
    return await this.salaryRepository.findOne({
      where,
      relations: ['user', 'user.department'],
      select: {
        id: true,
        salary_base: true,
        salary_bonus: true,
        extra_salary: true,
        create_at: true,
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
          department: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async addBonusSalary(
    id: number,
    extra_salary?: number,
    salary_bonus?: number,
  ): Promise<void> {
    const check = await this.salaryRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      throw new Error('Không tìm thấy id');
    }
    await this.salaryRepository.update(id, { extra_salary, salary_bonus });
  }

  //################################################
  async salaryDetail(userId: number): Promise<Salary> {
    try {
      const { startOfMonth, endOfMonth } = await this.getMonthRange();
      return await this.salaryRepository.findOne({
        where: { userId, create_at: Between(startOfMonth, endOfMonth) },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async indexCommission(user_code: string): Promise<any> {
    try {
      const { startOfMonth, endOfMonth } = await this.getMonthRange();

      const commissions = await this.comissionRepository.find({
        where: {
          user_manager: user_code,
          create_at: Between(startOfMonth, endOfMonth),
        },
      });

      const totalProfit = commissions.reduce(
        (sum, commission) => sum + commission.profit,
        0,
      );

      return totalProfit / 10;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async indexAffilate(userId: number): Promise<Affiliate> {
    try {
      return await this.affiliateRepository.findOne({ where: { userId } });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async indexCustomer():Promise<any>{
    try {
      
    } catch (error) {
      throw new Error(error)
    }
  }
}
