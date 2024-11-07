import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/users';
import { Brackets, FindOptionsWhere, In, Like, Or, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BranchingService } from '../branching/branching.service';
import { LoginDTO } from './dto/login.dto';
import { HttpStatus } from 'src/global/globalEnum';
import { UpdateUserDto } from './dto/update.dto';
import { Department } from 'src/typeorm/entities/department';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { Role } from 'src/typeorm/enum/role.enum';
import { deleteFile, saveFile } from 'src/global/globalFile';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { forgotPasswordDTO } from './dto/forgotPssword.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { updateLocale } from 'moment';
import { Branches } from 'src/typeorm/entities/branches';
require('dotenv').config();
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private BranchingService: BranchingService,
    @InjectRepository(Department)
    private departmentRepositoty: Repository<Department>,
    @InjectRepository(Branches)
    private branchesRepository: Repository<Branches>,
    private globalRecusive: GlobalRecusive,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async generateToken(payload: {
    id: number;
    email: string;
    role: string;
  }) {
    const [accessToken, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: 'vya8ygda87dy987y19e812e9ug2197td183tg12gvc712',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: 'vya8ygda87dy987y19e812e9ug2197td183tg12gvc712',
      }),
    ]);

    return { accessToken };
  }

  //register
  async register(createUserDto: CreateDto): Promise<any> {
    const checkMail = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (checkMail) throw new Error('Email đã tồn tại!');

    const hashPassword = await this.hashPassword(createUserDto.password);

    const checkDepartment = await this.departmentRepositoty.findOne({
      where: {
        id: createUserDto.departmentId,
      },
    });

    if (!checkDepartment) throw new Error('Department id not found!');

    const randomNumbers = Array.from(
      {
        length: 4,
      },
      () => Math.floor(Math.random() * 10),
    );

    const User_code = `NET${randomNumbers.join('')}`;

    const checkUserCode = await this.usersRepository.findOne({
      where: {
        user_code: User_code,
      },
    });

    if (checkUserCode)
      throw new Error('Vui lòng chọn mã nhân viên khác mã này đã tồn tại!');
    const result = await this.usersRepository.save({
      ...createUserDto,
      user_code: User_code,
      password: hashPassword,
      departmentId: createUserDto.departmentId,
    });
    if (createUserDto.branchId) {
      await this.BranchingService.createUserBranching(
        result.id,
        createUserDto.branchId,
      );
    }
    await this.mailerService.sendMail(
      createUserDto.email,
      'Thư thông báo',
      '',
      this.mailerService.notificationNew(result.fullname),
    );
    return result;
  }

  //login
  async login(loginDto: LoginDTO): Promise<Users> {
    try {
      const { email, password } = loginDto;
      const user: any = await this.usersRepository.findOne({
        relations: ['department', 'branching', 'branching.branch'],
        where: { email, delete_at: false },
      });
      if (user?.status === StatusUser.NOT_APPROVE) {
        throw new Error('Vui lòng đợi phòng nhân sự duyệt tài khoản');
      }

      if (user?.status !== StatusUser.ACTIVE)
        throw new Error('Tài khoản của bạn hiện đang bị tạm khóa');

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Email hoặc password không chính xác');
      }
      const branchManager = await this.branchesRepository.find({
        where: { manager: user.user_code },
      });
      const manager = await this.branchesRepository.findOne({
        where: {
          manager: user.manager,
        },
      });

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        user_code: user.user_code,
        departmentId: user.departmentId,
      };
      const token = await this.generateToken(payload);
      user.password = undefined;
      user.managerBranch = [...branchManager, manager];
      return { ...user, ...token };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //update user
  async updateUser(data: UpdateUserDto, id: number): Promise<void> {
    console.log(data);
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updateData: Partial<Users> = { ...data };

    Object.assign(userToUpdate, updateData);
    await this.usersRepository.save(userToUpdate);
    if (data.branchId) {
      await this.BranchingService.updateUserBranching(id, data.branchId);
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const verifyPassword = await bcrypt.compare(oldPassword, user.password);
    if (!verifyPassword) {
      throw new Error('Mật khẩu không đúng');
    }
    const hashPassword = await this.hashPassword(newPassword);
    await this.usersRepository.update(
      { id: userId },
      { password: hashPassword },
    );
  }

  //get all user follow option
  async getAllUserFollowOption(
    options: PaginationOptions & {
      keyword?: string;
      branch_id?: number;
      department_id?: number;
      role?: string;
    },
    user_code: string,
  ): Promise<PaginatedResult<Users & { managerInfo?: Partial<Users> }> | any> {
    const checkRole = await this.usersRepository.findOne({
      relations: ['department'],
      where: {
        user_code: user_code,
        status: StatusUser.ACTIVE,
      },
    });

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
    let where: FindOptionsWhere<any> = {
      delete_at: false,
      status: StatusUser.ACTIVE, // Chỉ lấy người dùng đang active
    };

    // If it's a leader of the administrative department, allow viewing all active users
    if (
      checkRole.role === Role.LEADER_EMPLOYEE 
    ) {
      // Không cần thay đổi điều kiện
    } else {
      // Lọc người dùng theo mã người dùng phụ thuộc
      const subordinateUserCodes =
        await this.globalRecusive.getAllSubordinateUserCodes(user_code);
      const allUserCodes = [user_code, ...subordinateUserCodes];
      where.user_code = In(allUserCodes);
    }

    if (options.branch_id) where.branching = { branchId: options.branch_id };
    if (options.department_id) where.department = { id: options.department_id };
    if (options.role) where.role = options.role as Role;

    // Search conditions
    if (options.keyword && options.keyword.trim() !== '') {
      const searchText = options.keyword.trim();
      where = [
        { ...where, user_code: Like(`%${searchText}%`) },
        { ...where, fullname: Like(`%${searchText}%`) },
        { ...where, email: Like(`%${searchText}%`) },
        { ...where, phone: Like(`%${searchText}%`) },
      ];
    }

    // Thực hiện phân trang với điều kiện tìm kiếm và các quan hệ liên quan

    const paginatedResult = await PaginationService.paginate<Users>(
      this.usersRepository,
      options,
      where,
      ['branching', 'branching.branch', 'department'], // Các quan hệ cần lấy
      {
        ...select,
        branching: {
          id: true,
          branch: {
            id: true,
            name: true,
          },
        },
        department: {
          id: true,
          name: true,
        },
      },
    );

    // Lấy thông tin quản lý cho mỗi người dùng

    // Fetch manager info
    const usersWithManagerInfo = await Promise.all(
      paginatedResult.data.map(async (user) => {
        if (user.manager) {
          const managerInfo = await this.usersRepository.findOne({
            select: {
              ...select,
            },
            where: {
              user_code: user.manager,
              delete_at: false,
              status: StatusUser.ACTIVE,
            },
          });

          if (managerInfo) {
            return { ...user, managerInfo };
          }
        }
        return user;
      }),
    );

    // Lọc ra danh sách các quản lý

    const managerList = usersWithManagerInfo.filter(
      (user) => ![Role.MAKETER, Role.SALE, Role.INTERN].includes(user.role),
    );

    return {
      ...paginatedResult,
      data: usersWithManagerInfo,
      manager: managerList,
    };
  }

  //get user was block
  async getAllUserWasBlock(
    options: PaginationOptions & {
      keyword?: string;
      branch_id?: number;
      department_id?: number;
      role?: string;
    },
    user_code: string,
  ): Promise<PaginatedResult<Users & { managerInfo?: Partial<Users> }>> {
    const checkRole = await this.usersRepository.findOne({
      relations: ['department'],
      where: {
        user_code: user_code,
      },
    });

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

    let where: FindOptionsWhere<any> = {
      delete_at: false,
      status: StatusUser.BLOCK,
    };

    // Các điều kiện tìm kiếm khác
    if (options.keyword && options.keyword.trim() !== '') {
      const searchText = options.keyword.trim();
      where = [
        { user_code: Like(`%${searchText}%`) },
        { fullname: Like(`%${searchText}%`), ...where },
        { email: Like(`%${searchText}%`), ...where },
        { phone: Like(`%${searchText}%`), ...where },
      ];
    }

    if (options.branch_id) where.branching = { branchId: options.branch_id };
    if (options.department_id) where.department = { id: options.department_id };
    if (options.role) where.role = options.role as Role;
    const paginatedResult = await PaginationService.paginate<Users>(
      this.usersRepository,
      options,
      where,
      ['branching', 'branching.branch', 'department'],
      {
        ...select,
        branching: {
          id: true,
          branch: {
            id: true,
            name: true,
          },
        },
        department: {
          id: true,
          name: true,
        },
      },
    );

    // Lấy thông tin manager
    const usersWithManagerInfo = await Promise.all(
      paginatedResult.data.map(async (user) => {
        if (user.manager) {
          const managerInfo = await this.usersRepository.findOne({
            select: {
              ...select,
            },
            where: { user_code: user.manager, delete_at: false },
          });

          if (managerInfo) {
            return { ...user, managerInfo };
          }
        }
        return user;
      }),
    );

    return {
      ...paginatedResult,
      data: usersWithManagerInfo,
    };
  }

  //get id user
  async getUserId(
    id: number,
  ): Promise<Users & { managerInfo?: Partial<Users> }> {
    let select = {
      id: true,
      user_code: true,
      email: true,
      fullname: true,
      phone: true,
      duty: true,
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
      branching: {
        id: true,
        branch: {
          id: true,
          name: true,
        },
      },
      department: {
        id: true,
        name: true,
      },
    };
    const user = await this.usersRepository.findOne({
      relations: ['branching', 'branching.branch', 'department'],
      select,
      where: { id },
    });

    if (user && user.manager) {
      const managerInfo = await this.usersRepository.findOne({
        select,
        where: { user_code: user.manager, delete_at: false },
      });

      if (managerInfo) {
        return { ...user, managerInfo };
      }
    }
    return user;
  }

  async getCustomerId(
    id: number,
  ): Promise<Users & { managerInfo?: Partial<Users> }> {
    let select = {
      id: true,
      user_code: true,
      fullname: true,
      duty: true,
      role: true,
      manager: true,
      branching: {
        id: true,
        branch: {
          id: true,
          name: true,
        },
      },
      department: {
        id: true,
        name: true,
      },
    };
    const user = await this.usersRepository.findOne({
      relations: ['branching', 'branching.branch', 'department'],
      select,
      where: { id },
    });

    if (user && user.manager) {
      const managerInfo = await this.usersRepository.findOne({
        select,
        where: { user_code: user.manager, delete_at: false },
      });

      if (managerInfo) {
        return { ...user, managerInfo };
      }
    }
    return user;
  }

  //delete soft
  async deleteUser(id: number, user_code: string, role: string): Promise<void> {
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    userToUpdate.delete_at = true;
    userToUpdate.status = StatusUser.BLOCK;
    userToUpdate.update_at = new Date();
    await this.usersRepository.save(userToUpdate);
  }

  //block user
  async blockUser(id: number, user_code: string, role: string): Promise<void> {
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    userToUpdate.status = StatusUser.BLOCK;
    await this.usersRepository.save(userToUpdate);
  }

  //unLock user
  async unLockUser(id: number, user_code: string, role: string): Promise<void> {

    const userToUpdate = await this.usersRepository.findOneBy({ id });
    userToUpdate.status = StatusUser.ACTIVE;
    await this.usersRepository.save(userToUpdate);
  }

  //get user delete soft
  async getUserDelete(
    user_code: string,
    role: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {

    let select = {
      id: true,
      user_code: true,
      email: true,
      fullname: true,
      phone: true,
      duty: true,
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
      delete_at: true,
      status: true,
      branching: {
        id: true,
        branch: {
          id: true,
          name: true,
        },
      },
      department: {
        id: true,
        name: true,
      },
    };
    const relations = ['branching', 'branching.branch', 'department'];
    const where = { delete_at: true };

    const result = await PaginationService.paginate(
      this.usersRepository,
      { page, limit },
      where,
      relations,
      select,
      {},
    );

    const usersWithManagerInfo = await Promise.all(
      result.data.map(async (user) => {
        if (user.user_code) {
          const managerInfo = await this.usersRepository.findOne({
            select: {
              ...select,
            },
            where: { user_code: user.manager, delete_at: false },
          });

          if (managerInfo) {
            return { ...user, managerInfo };
          }
        }
        return user;
      }),
    );
    return {
      ...result,
      data: usersWithManagerInfo,
    };
  }

  //get list cap duoi leader
  async getAllSubordinatesFlat(id: number): Promise<any[]> {
    try {
      const leader = await this.usersRepository.findOneBy({ id });
      if (!leader) {
        throw new Error('Leader not found');
      }

      const allUsers = await this.usersRepository.find({
        relations: ['branching', 'branching.branch', 'department'],
        select: {
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
          branching: {
            id: true,
            branch: {
              id: true,
              name: true,
            },
          },
          department: {
            id: true,
            name: true,
          },
        },
        where: { delete_at: false },
      });

      // Create a map of user_code to user object for quick lookup
      const userMap = new Map(allUsers.map((user) => [user.user_code, user]));

      function getAllSubordinatesRecursive(
        userCode: string,
        result: Set<string> = new Set(),
      ): Set<string> {
        const subordinates = allUsers.filter((u) => u.manager === userCode);

        for (const subordinate of subordinates) {
          if (!result.has(subordinate.user_code)) {
            result.add(subordinate.user_code);
            getAllSubordinatesRecursive(subordinate.user_code, result);
          }
        }

        return result;
      }

      const subordinateUserCodes = getAllSubordinatesRecursive(
        leader.user_code,
      );
      const result = Array.from(subordinateUserCodes).map((code) => {
        const user = userMap.get(code);
        const manager = user.manager ? userMap.get(user.manager) : null;
        return {
          ...user,
          manager: manager
            ? {
                user_code: manager.user_code,
                fullname: manager.fullname,
                email: manager.email,
                accountBank: manager.accountBank,
                CV: manager.CV,
                duty: manager.duty,
                phone: manager.phone,
                role: manager.role,
                gender: manager.gender,
                date_of_birth: manager.date_of_birth,
                attendance_code: manager.attendance_code,
                cccd_front: manager.cccd_front,
                cccd_back: manager.cccd_back,
                avatar: manager.avatar,
                delete_at: manager.delete_at,
                status: manager.status,
              }
            : null,
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  private async generateRandomPassword(length: number = 10): Promise<string> {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async forgotPassword(data: forgotPasswordDTO): Promise<void> {
    try {
      const checkEmail = await this.usersRepository.findOne({
        where: {
          email: data.email,
        },
      });
      if (!checkEmail) throw new Error('Email không tồn tại');
      const passwordRandom = await this.generateRandomPassword();
      const hashPassword = await this.hashPassword(passwordRandom);
      checkEmail.password = hashPassword;
      await this.usersRepository.save(checkEmail);
      await this.mailerService.sendMail(
        checkEmail.email,
        'Reset mật khẩu',
        '',
        this.mailerService.createHtml(checkEmail.fullname, passwordRandom),
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getListUserPending(
    options: PaginationOptions & {
      keyword?: string;
      branch_id?: number;
      department_id?: number;
      role?: string;
    },
    user_code: string,
  ): Promise<PaginatedResult<Users & { managerInfo?: Partial<Users> }>> {
    const checkRole = await this.usersRepository.findOne({
      relations: ['department'],
      where: {
        user_code: user_code,
      },
    });

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

    let where: FindOptionsWhere<any> = {
      delete_at: false,
      status: StatusUser.NOT_APPROVE,
    };

    // Các điều kiện tìm kiếm khác
    if (options.keyword && options.keyword.trim() !== '') {
      const searchText = options.keyword.trim();
      where = [
        { user_code: Like(`%${searchText}%`) },
        { fullname: Like(`%${searchText}%`), ...where },
        { email: Like(`%${searchText}%`), ...where },
        { phone: Like(`%${searchText}%`), ...where },
      ];
    }

    if (options.branch_id) where.branching = { branchId: options.branch_id };
    if (options.department_id) where.department = { id: options.department_id };
    if (options.role) where.role = options.role as Role;
    const paginatedResult = await PaginationService.paginate<Users>(
      this.usersRepository,
      options,
      where,
      ['branching', 'branching.branch', 'department'],
      {
        ...select,
        branching: {
          id: true,
          branch: {
            id: true,
            name: true,
          },
        },
        department: {
          id: true,
          name: true,
        },
      },
    );

    // Lấy thông tin manager
    const usersWithManagerInfo = await Promise.all(
      paginatedResult.data.map(async (user) => {
        if (user.manager) {
          const managerInfo = await this.usersRepository.findOne({
            select: {
              ...select,
            },
            where: { user_code: user.manager, delete_at: false },
          });

          if (managerInfo) {
            return { ...user, managerInfo };
          }
        }
        return user;
      }),
    );

    return {
      ...paginatedResult,
      data: usersWithManagerInfo,
    };
  }
}
