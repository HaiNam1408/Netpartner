import { HttpException, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branches } from 'src/typeorm/entities/branches';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { Users } from 'src/typeorm/entities/users';
import { Branching } from 'src/typeorm/entities/branching';
import { Role } from 'src/typeorm/enum/role.enum';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { Commissions } from 'src/typeorm/entities/commissions';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Customers } from 'src/typeorm/entities/Customers';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branches)
    private branchesRepository: Repository<Branches>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Branching)
    private branchingRepository: Repository<Branching>,
    @InjectRepository(Commissions)
    private commissionsRepository: Repository<Commissions>,
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
    private globalRecusive: GlobalRecusive,
  ) {}
  async createBranches(data: CreateBranchDto): Promise<Branches> {
    return this.branchesRepository.save(data);
  }

  async findBranchesFollowName(title: string): Promise<Branches[]> {
    let branches;

    if (title) {
      branches = await this.branchesRepository.find({
        where: {
          name: Like(`%${title}%`),
        },
      });
    } else {
      branches = await this.branchesRepository.find();
    }

    const result = [];

    for (let branch of branches) {
      const managerInfo = await this.userRepository.findOne({
        where: {
          user_code: branch.manager,
        },
      });
      result.push({
        ...branch,
        managerInfo: managerInfo ? { ...managerInfo } : null,
      });
    }

    return result;
  }
  async getBranchId(id: number): Promise<Branches> {
    return this.branchesRepository.findOneBy({ id });
  }

  async formatData(data: any, user_code: string): Promise<any[]> {
    return data.map((object) => ({
      id: object.user_code,
      email: object.email,
      fullname: object.fullname,
      phone: object.phone,
      accountBank: object.accountBank,
      CV: object.CV,
      duty: object.duty,
      role: object.role,
      gender: object.gender,
      date_of_birth: object.date_of_birth,
      attendance_code: object.attendance_code,
      cccd_front: object.cccd_front,
      cccd_back: object.cccd_back,
      avatar: object.avatar,
      delete_at: object.delete_at,
      parentId: user_code == object.user_code ? '' : object.manager,
      status: object.status,
    }));
  }

  //lay danh sach nhan vien cap duoi
  async findListSubordinates(user_code: string) {


    // Lấy tất cả user_code của cấp dưới
    const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    // Thêm user_code hiện tại vào danh sách
    const allUserCodes = [user_code, ...subordinateUserCodes];
    const select = {
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
      status: true,
    };
    let where: FindOptionsWhere<any> = {
      delete_at: false,
      user_code: In(allUserCodes),
    };

    const result = await this.userRepository.find({
      where,
      select,
    });
    const newResult = await this.formatData(result, user_code);
    return newResult;
  }

  async updateBranches(
    id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branches> {
    const branchesToUpdate = await this.branchesRepository.findOneBy({ id });
    Object.assign(branchesToUpdate, updateBranchDto);
    return this.branchesRepository.save(branchesToUpdate);
  }

  async removeBranches(id: number) {
    const check = await this.branchesRepository.findOne({ where: { id: id } });
    if (!check) {
      throw new Error('Id không tồn tại!');
    }
    await this.branchingRepository.delete({ branchId: check.id });
    return this.branchesRepository.delete(id);
  }

  async calculateTotalRebate() {
    const branches = await this.branchesRepository.find({
      relations: ['branchings']
    });

    let totalRebate = 0;
    const branchRebates = [];

    for (const branch of branches) {
      const userIds = branch.branchings.map((branching) => branching.userId);
      const userList = await this.userRepository.find({
        where: {
          id: In(userIds),
        },
      })
      const userCodes = userList.map((user) => user.user_code).filter((code) => code !== 'Net0000');
      let branchRebate;
      if (userIds.length > 0) {
         branchRebate = await this.commissionsRepository
          .createQueryBuilder('commissions')
           .where('commissions.user_manager IN (:...userCodes)', { userCodes: userCodes })
          .select('SUM(commissions.ib)', 'totalRebate')
          .getRawOne();
        }
        
        // Xử lý kết quả rebate
        branchRebates.push({
          branchName: branch.name,
          totalRebate: branchRebate?.totalRebate ? parseFloat(branchRebate.totalRebate) : 0,
        });
  
        totalRebate += branchRebate?.totalRebate ? parseFloat(branchRebate.totalRebate) : 0;
    }

    return {
      totalRebate,
      branchRebates,
    };
  }

  async getStatistics(user_code:string): Promise<{
    totalActive: number;
    totalBlock: number;
    totalNotActive: number;
    totalUser: number;
  }> {
    try {
      const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
      const [totalActive, totalBlock, totalNotActive] = await Promise.all([
        this.userRepository.count({ where: {user_code:In(subordinateUserCodes), status: StatusUser.ACTIVE } }),
        this.userRepository.count({ where: {user_code:In(subordinateUserCodes), status: StatusUser.BLOCK, delete_at:false } }),
        this.userRepository.count({ where: {user_code:In(subordinateUserCodes), status: StatusUser.NOT_APPROVE } }),
      ]);

      const totalUser = totalActive + totalBlock + totalNotActive;

      return {
        totalActive,
        totalBlock,
        totalNotActive,
        totalUser,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }



  async getDetailBranchStaff(user_code: string, page: number = 1, limit: number = 10) {
    // Lấy tất cả các subordinate user codes
    const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
  
    // Truy vấn tất cả các nhân viên dựa vào các subordinate user codes và phân trang
    const [result, total] = await this.userRepository.findAndCount({
      select: ['user_code', 'fullname'],  // Trả về user_code và họ tên
      where: {
        user_code: In(subordinateUserCodes),
        status: StatusUser.ACTIVE,
        delete_at: false
      },
      skip: (page - 1) * limit, // Bỏ qua các bản ghi trước trang hiện tại
      take: limit // Số lượng bản ghi trả về
    });
  
    // Tạo một mảng để lưu kết quả cuối cùng với số lượng khách hàng
    const staffDetails = await Promise.all(result.map(async (user) => {
      // Đếm số lượng khách hàng của nhân viên dựa vào user_code của họ
      const customerCount = await this.customerRepository.count({ where: { saler: user.user_code } });
      
     
      return {
        full_name: user.fullname,
        lots: 0,
        fundMM: 0,
        customer_count: customerCount,
      };
    }));
  
  
    return {
      data: staffDetails, 
      total, 
      page,
      limit, 
      totalPages: Math.ceil(total / limit), 
    };
  }
  


}
