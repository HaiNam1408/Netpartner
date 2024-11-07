import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestonesTree } from 'src/typeorm/entities/milestones-tree.entity';
import { CreateUpdateMilestonesTreeDTO } from './dto/create-update-milestones-tree.dto';
import { GetAllMilestonesTreeDTO } from './dto/get-all-milestones-tree.dto';
import { PaginatedResult } from 'src/global/globalPagination';

@Injectable()
export class MilestonesTreeService {
  constructor(
    @InjectRepository(MilestonesTree)
    private readonly repository: Repository<MilestonesTree>,
  ) {}

  async createMilestonesTree(
    dto: CreateUpdateMilestonesTreeDTO,
  ): Promise<MilestonesTree> {
    return await this.repository.save(dto);
  }

  async updateMilestonesTree(
    dto: CreateUpdateMilestonesTreeDTO,
    id: number,
  ): Promise<any> {
    return this.repository.update(id, dto);
  }

  async getAllMilestonesTrees(
    dto: GetAllMilestonesTreeDTO,
  ): Promise<PaginatedResult<MilestonesTree>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      take: limit,
      skip,
      relations: ['achievementLogs', 'achievementTree'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDetailsMilestonesTree(id: number): Promise<MilestonesTree> {
    return await this.repository.findOne({
      where: { id },
      relations: ['achievementLogs', 'achievementTree'],
    });
  }

  async deleteMilestonesTree(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
