import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/global/globalPagination';
import { AchievementLog } from 'src/typeorm/entities/achievement-log.entity';
import { CreateUpdateAchievementLogDTO } from './dto/create-update-milestones-tree.dto';
import { GetAllAchievementLogDTO } from './dto/get-all-milestones-tree.dto';

@Injectable()
export class AchievementLogService {
  constructor(
    @InjectRepository(AchievementLog)
    private readonly repository: Repository<AchievementLog>,
  ) {}

  async createAchievementLog(
    dto: CreateUpdateAchievementLogDTO,
  ): Promise<AchievementLog> {
    return await this.repository.save({
      achievementTreeId: dto.milestonesTreeId,
      desc: dto.desc,
      imagePath: dto.imagePath,
      isDone: dto.isDone,
      userId: dto.userId,
    });
  }

  async updateAchievementLog(
    dto: CreateUpdateAchievementLogDTO,
    id: number,
  ): Promise<any> {
    return this.repository.update(id, dto);
  }

  async getAllAchievementLogs(
    dto: GetAllAchievementLogDTO,
  ): Promise<PaginatedResult<AchievementLog>> {
    const { page, limit, userId } = dto;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      where: {
        userId,
      },
      take: limit,
      skip,
      relations: ['milestonesTree'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDetailsAchievementLog(id: number): Promise<AchievementLog> {
    return await this.repository.findOne({
      where: { id },
      relations: ['milestonesTree'],
    });
  }

  async deleteAchievementLog(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
