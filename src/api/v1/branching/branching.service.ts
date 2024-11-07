import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { Branches } from 'src/typeorm/entities/branches';
import { Branching } from 'src/typeorm/entities/branching';
import { Users } from 'src/typeorm/entities/users';
import { Role } from 'src/typeorm/enum/role.enum';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class BranchingService {
  constructor(
    @InjectRepository(Branching)
    private branchingRepository: Repository<Branching>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Branches)
    private branchesRepository: Repository<Branches>,
  ) {}

  async createUserBranching(userId: number, branchId: number) {
    await this.branchingRepository.save({
      userId,
      branchId,
      created_at: Date(),
    });
  }

  async updateUserBranching(userId: number, branchId: any) {
    const checkBranchId = await this.branchingRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!checkBranchId) {
      await this.branchingRepository.save({
        userId: userId,
        branchId: branchId,
        created_at: Date(),
      });
    }
    await this.branchingRepository.update(checkBranchId.id, {
      branchId: branchId,
    });
  }

  //danh sach leader branch
  async getLeaderBranch(id: number): Promise<Branching[]> {
    const getAllUser = await this.branchingRepository.find({
      relations: ['branch', 'user'],
      where: {
        branch: { id: id },
        user: { role: Role.LEADER, status: StatusUser.ACTIVE },
      },
      select: {
        user: {
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
        },
      },
    });

    return getAllUser;
  }

  //danh sach nhan vien 1 chi nhanh
  async getAllBranchUser(
    id: number,
    limit: number = 10,
    page: number = 1,
  ): Promise<PaginatedResult<any>> {
    try {
      // Define pagination options
      const paginationOptions: PaginationOptions = { limit, page };
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
      // Fetch all users associated with the branch with pagination
      const paginatedUsers = await PaginationService.paginate(
        this.branchingRepository,
        paginationOptions,
        {
          branch: { id: id },
          user: {
            role: Not(In([Role.INTERN, Role.SALE, Role.MAKETER])),
            status: Not(In([StatusUser.NOT_APPROVE, StatusUser.BLOCK])),
          },
        },
        ['branch', 'user'],
        {
          user: {
            ...select,
          },
        },
      );

      const userBranch = await this.branchesRepository.findOne({
        where: { id: id },
      });
      const managerBranch = await this.usersRepository.findOne({
        where: {
          user_code: userBranch.manager,
          delete_at: false,
          status: StatusUser.ACTIVE,
        },
        select: {
          ...select,
        },
      });

      const combinedUsers = [
        ...paginatedUsers.data.map((branching) => branching.user),
        managerBranch,
      ];

      return {
        data: combinedUsers,
        total: paginatedUsers.total + (managerBranch ? 1 : 0),
        page: paginatedUsers.page,
        limit: paginatedUsers.limit,
        totalPages: Math.ceil(
          (paginatedUsers.total + (managerBranch ? 1 : 0)) /
            paginatedUsers.limit,
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
