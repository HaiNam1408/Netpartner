import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignments } from 'src/typeorm/entities/assignments';
import { Tasks } from 'src/typeorm/entities/tasks';
import { Between, In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTaskDto.dto';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { Role } from 'src/typeorm/enum/role.enum';
import { assignmentsAcceptance } from 'src/typeorm/enum/assignmentAcceptance.enum';
import { TaskType } from 'src/typeorm/enum/taskType';
import { Users } from 'src/typeorm/entities/users';
import { assignmentStatus } from 'src/typeorm/enum/assignmentStatus.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
    @InjectRepository(Assignments)
    private assignmentRepository: Repository<Assignments>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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

  async createTask(data: CreateTaskDto, manager: number) {
    const { userId, type } = data;
    if (type === TaskType.NHIEM_VU_DAC_THU) {
      const taskDT = await this.taskRepository.save({
        ...data,
        managerId: manager,
        checker_id: data.checker_id,
      });

      if (taskDT) {
        const currentYear = new Date().getFullYear(); // Lấy năm hiện tại (có thể tùy chỉnh)
        const month = 9; // Ví dụ: tháng 9 (có thể thay đổi thành bất kỳ tháng nào)
        const numberOfDaysInMonth = new Date(currentYear, month, 0).getDate(); // Lấy số ngày trong tháng

        for (let day = 1; day <= numberOfDaysInMonth; day++) {
          const assignmentDate = new Date(currentYear, month - 1, day);

          await this.assignmentRepository.save({
            userId: userId,
            taskId: taskDT.id,
            create_at: assignmentDate,
          });
        }
      }
      return taskDT;
    } else {
      const task = await this.taskRepository.save({
        ...data,
        managerId: manager,
        checker_id: data.checker_id,
      });
      if (task) {
        await this.assignmentRepository.save({
          userId: userId,
          taskId: task.id,
          create_at: new Date(),
        });
      }
      return task;
    }
  }

  async getTaskUser(
    userId: number,
    checkerId?: number,
    type?: string,
    dateRange?: [Date, Date],
  ): Promise<any> {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    const userSelect = {
      id: true,
      fullname: true,
      email: true,
      phone: true,
    };

    const taskSelect = {
      id: true,
      title: true,
      content: true,
      note: true,
      desc_detail: true,
      number_content: true,
      type: true,
      start_at: true,
      expire_at: true,
      create_at: true,
      update_at: true,
      manager: {
        id: true, // Chỉ lấy những trường cần thiết cho `task.manager`
        fullname: true,
        email: true,
        phone: true,
      },
      checker: {
        id: true, // Chỉ lấy những trường cần thiết cho `task.checker`
        fullname: true,
        email: true,
        phone: true,
      },
    };

    // Kiểm tra nếu có dateRange thì sử dụng nó, nếu không thì dùng startOfMonth và endOfMonth
    const [startDate, endDate] = dateRange
      ? dateRange
      : [startOfMonth, endOfMonth];

    // Lấy thông tin user
    const user = await this.assignmentRepository.findOne({
      relations: ['user'],
      where: { userId },
      select: { user: userSelect },
    });

    // Lấy danh sách nhiệm vụ (task)
    const tasks = await this.taskRepository.find({
      relations: ['assignment', 'manager', 'checker'],
      where: {
        checker_id: checkerId,
        assignment: { userId },
        create_at: Between(startDate, endDate),
        type,
      },
      select: taskSelect,
    });

    // Gộp thông tin user vào mỗi nhiệm vụ (task)
    const result = tasks.map((task) => ({
      ...task,
      user: user?.user, // Gắn thông tin user vào mỗi task
    }));

    return result;
  }

  async getUsersByChecker(
    checkerId: number,
    dateRange?: [Date, Date],
  ): Promise<any> {
    const { startOfMonth, endOfMonth } = await this.getMonthRange();

    // Kiểm tra nếu có dateRange thì sử dụng nó, nếu không thì dùng startOfMonth và endOfMonth
    const [startDate, endDate] = dateRange
      ? dateRange
      : [startOfMonth, endOfMonth];

    // Lấy danh sách các nhiệm vụ mà checker là người quản lý
    const tasks = await this.taskRepository.find({
      relations: ['assignment', 'assignment.user'],
      where: {
        checker_id: checkerId,
        create_at: Between(startDate, endDate),
      },
    });

    //Lấy danh sách user từ các nhiệm vụ
    const users = tasks.map((task) =>
      task.assignment.map((value) => value.user.id),
    );

    // Loại bỏ các giá trị undefined hoặc trùng lặp (nếu có)

    const uniqueUsers = Array.from(new Set(users.flatMap((user) => user)));
    const listUser = await this.usersRepository.find({
      where: {
        id: In(uniqueUsers),
      },
      select: {
        id: true,
        fullname: true,
      },
    });
    return listUser;
  }

  async getListAssignment(
    type: string,
    limit: number = 10,
    page: number = 1,
    user: any,
  ): Promise<PaginatedResult<any>> {
    try {
      const paginationOptions: PaginationOptions = { limit, page };
      const select = {
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
      const orderBy = { create_at: 'DESC' };
      let whereConditions: any = {};
      const Boss = user.role === Role.CEO;

      const justSeenYourSelf =
        user.role === Role.SALE ||
        user.role === Role.MAKETER ||
        user.role === Role.INTERN ||
        user.role === Role.SALES_ASSISTANT;

      const justSeenYourSelfAndSubordinates =
        user.role === Role.MANAGER || user.role === Role.LEADER || user.role === Role.LEADER_EMPLOYEE;
      if (Boss) {
        // CEO có thể xem tất cả các yêu cầu
        whereConditions = { type };
      } else if (justSeenYourSelf) {
        // Các vai trò chỉ có thể xem yêu cầu của chính mình
        whereConditions = { userId: user.id, type };
      } else if (justSeenYourSelfAndSubordinates) {
        // Các vai trò có thể xem yêu cầu của chính mình và cấp dưới
        whereConditions = [
          { userId: user.id }, // Bản ghi do chính người đó tạo
          { task: { checker_id: user.id } }, // Bản ghi của cấp dưới
          type,
        ];
      } else {
        // Nếu vai trò không được định nghĩa, trả về kết quả trống
        return { data: [], total: 0, page, limit, totalPages: 0 };
      }

      const paginatedResult = await PaginationService.paginate(
        this.assignmentRepository,
        paginationOptions,
        whereConditions,
        ['user', 'task', 'task.manager', 'task.checker'],
        {
          id: true,
          status: true,
          acceptance: true,
          result: true,
          create_at: true,
          update_at: true,
          user: {
            ...select,
          },
          task: {
            id: true,
            title: true,
            content: true,
            start_at: true,
            expire_at: true,
            create_at: true,
            update_at: true,
            manager: {
              ...select,
            },
            checker: {
              ...select,
            },
          },
        },
        orderBy,
      );

      return paginatedResult;
    } catch (error) {
      throw error;
    }
  }

  async getAssignmentId(id: number) {
    const select = {
      id: true,
      user_code: true,
      email: true,
      fullname: true,
      phone: true,
      accountBank: true,
      CV: true,
      duty: true,
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
    const result = await this.assignmentRepository.findOne({
      relations: ['user', 'task', 'task.manager', 'task.checker'],
      where: {
        id: id,
      },
      select: {
        id: true,
        status: true,
        acceptance: true,
        result: true,
        create_at: true,
        update_at: true,
        user: {
          ...select,
        },
        task: {
          id: true,
          title: true,
          content: true,
          start_at: true,
          expire_at: true,
          create_at: true,
          update_at: true,
          manager: {
            ...select,
          },
          checker: {
            ...select,
          },
        },
      },
    });
    return result;
  }

  async updateAssignmentStatus(
    body: UpdateStatusDto,
    user_id: number,
    id_assignment: number,
  ) {
    const check = await this.assignmentRepository.findOne({
      relations: ['task'],
      where: {
        id: id_assignment,
      },
      select: {
        task: {
          checker_id: true,
          managerId: true,
        },
      },
    });
    if (check.userId === user_id) {
      Object.assign(check, { status: body?.status, result: body?.result });
      await this.assignmentRepository.save(check);
    } else if (
      check.task.checker_id === user_id ||
      check.task.managerId === user_id
    ) {
      if (body.acceptance === assignmentsAcceptance.NOT_OK) {
        check.reason = body.reason;
      }
      Object.assign(check, { acceptance: body.acceptance });
      await this.assignmentRepository.save(check);
    } else {
      throw new Error('Bạn không có quyền cập nhật');
    }
  }

  async countTaskStatusForUser(userId: number): Promise<any> {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.assignment', 'assignment')
      .select([
        'YEAR(task.create_at) AS year', // Group by year
        'MONTH(task.create_at) AS month', // Group by month
        "SUM(CASE WHEN assignment.status = 'Hoàn thành' THEN 1 ELSE 0 END) AS doneCount",
        "SUM(CASE WHEN assignment.status = 'Chưa hoàn thành' OR assignment.status = 'in progress' THEN 1 ELSE 0 END) AS notDoneCount",
        "SUM(CASE WHEN assignment.status = 'Bị trễ' THEN 1 ELSE 0 END) AS delayedCount",
        'COUNT(task.id) AS totalCount',
      ])
      .where('assignment.userId = :userId', { userId })
      .groupBy('YEAR(task.create_at), MONTH(task.create_at)') // Group by year and month
      .orderBy('YEAR(task.create_at)', 'ASC') // Order by year first
      .addOrderBy('MONTH(task.create_at)', 'ASC') // Then order by month
      .getRawMany();

    // Return the result as an array of month-wise status counts
    return result.map((item) => ({
      year: parseInt(item.year, 10),
      month: parseInt(item.month, 10),
      done: parseInt(item.doneCount, 10) || 0,
      notDone: parseInt(item.notDoneCount, 10) || 0,
      delayed: parseInt(item.delayedCount, 10) || 0,
      total: parseInt(item.totalCount, 10) || 0,
    }));
  }

  async deleteAssignment(id: number) {
    return this.assignmentRepository.delete(id);
  }

  async getAssigmentNotOk(
    userId: number,
    type: TaskType,
    limit: number,
    page: number,
    start_at?: Date,
    end_at?: Date,
  ): Promise<any> {
    const where: any = {
      user: {
        id: userId,
      },
      task: {
        type: type,
      },
      status: assignmentStatus.PENDING,
    };

    if (start_at && end_at) {
      where.create_at = Between(start_at, end_at);
    }

    const select = {
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
    const orderBy = { create_at: 'DESC' };

    const paginatedResult = await PaginationService.paginate(
      this.assignmentRepository,
      { page, limit },
      where,
      ['user', 'task', 'task.manager', 'task.checker'],
      {
        id: true,
        status: true,
        acceptance: true,
        result: true,
        create_at: true,
        update_at: true,
        user: {
          ...select,
        },
        task: {
          id: true,
          title: true,
          content: true,
          start_at: true,
          expire_at: true,
          create_at: true,
          update_at: true,
          manager: {
            ...select,
          },
          checker: {
            ...select,
          },
        },
      },
      orderBy,
    );

    return paginatedResult;
  }

}
