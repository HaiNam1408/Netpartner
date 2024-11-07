import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementTree } from 'src/typeorm/entities/achievement-tree.entity';
import { CreateUpdateAchievementTreeDTO } from './dto/create-update-achievement-tree.dto';
import { GetAllAchievementTreeDTO } from './dto/get-all-achivement-tree.dto';
import { PaginatedResult } from 'src/global/globalPagination';
import { MilestonesTree } from 'src/typeorm/entities/milestones-tree.entity';
import { UserProcessAchievementTree } from 'src/typeorm/entities/user-process-achievement-tree.entity';

@Injectable()
export class AchievementTreeService {
  constructor(
    @InjectRepository(AchievementTree)
    private readonly repository: Repository<AchievementTree>,
    @InjectRepository(MilestonesTree)
    private readonly milestonesTreeRepository: Repository<MilestonesTree>,
    @InjectRepository(UserProcessAchievementTree)
    private readonly userProcessAchievementTreeRepository: Repository<UserProcessAchievementTree>,
  ) {}

  async createAchievementTree(
    dto: CreateUpdateAchievementTreeDTO,
  ): Promise<AchievementTree> {
    const executeDate = new Date();
    const achievementTree = new AchievementTree();
    achievementTree.nameTree = dto.nameTree;
    achievementTree.typeTree = dto.typeTree;
    achievementTree.createAt = executeDate;
    achievementTree.updateAt = executeDate;

    const savedAchievementTree = await this.repository.save(achievementTree);

    const dataMilestonesTrees: MilestonesTree[] = [];
    for (const element of dto.dataMilestonesTree) {
      const dataTemp = new MilestonesTree();
      dataTemp.achievementTreeId = savedAchievementTree.id;
      dataTemp.value = element.value;
      dataTemp.imagePath = element.imagePath;
      dataTemp.desc = element.desc;
      dataTemp.createAt = executeDate;
      dataTemp.updateAt = executeDate;
      dataMilestonesTrees.push(dataTemp);
    }

    await this.milestonesTreeRepository.save(dataMilestonesTrees);

    return savedAchievementTree;
  }

  async updateAchievementTree(
    dto: CreateUpdateAchievementTreeDTO,
    id: number,
  ): Promise<any> {
    const executeDate = new Date();
    const existedAchievementTree = await this.repository.findOneBy({ id });

    if (!existedAchievementTree) {
      throw new HttpException('NOT FOUND', 404);
    }

    const savedAchievementTree = await this.repository.save({
      ...existedAchievementTree,
      nameTree: dto.nameTree,
      typeTree: dto.typeTree,
    });

    if (dto.dataMilestonesTree.length === 0) {
      const _dataExisted = await this.milestonesTreeRepository.findBy({
        achievementTreeId: id,
      });
      if (_dataExisted.length > 0) {
        const _idsToDelete = _dataExisted.map((e) => e.id);
        await this.milestonesTreeRepository.delete(_idsToDelete);
      }
    } else {
      const milestonesToSave = [];

      for (const element of dto.dataMilestonesTree) {
        if (element.id) {
          const _exMilestones = await this.milestonesTreeRepository.findOneBy({
            id: element.id,
          });
          if (_exMilestones) {
            milestonesToSave.push({
              ..._exMilestones,
              value: element.value,
              imagePath: element.imagePath,
              desc: element.desc,
              updateAt: executeDate,
            });
          }
        } else {
          const dataTemp = new MilestonesTree();
          dataTemp.achievementTreeId = id;
          dataTemp.value = element.value;
          dataTemp.imagePath = element.imagePath;
          dataTemp.desc = element.desc;
          dataTemp.createAt = executeDate;
          dataTemp.updateAt = executeDate;
          milestonesToSave.push(dataTemp);
        }
      }

      if (milestonesToSave.length > 0) {
        await this.milestonesTreeRepository.save(milestonesToSave);
      }
    }

    return savedAchievementTree;
  }

  async getAllAchievementTree(
    dto: GetAllAchievementTreeDTO,
  ): Promise<PaginatedResult<AchievementTree>> {
    const { page, limit, userId, baseTree, typeTree } = dto;
    const skip = (page - 1) * limit;

    // Fetch all entries with relations
    const data = await this.repository.find({
      where: {
        baseTree,
        typeTree,
      },
      relations: ['userProcesses', 'milestones'],
    });

    // Apply userId filter if provided
    let filteredData: AchievementTree[] = data;
    if (userId) {
      let tmp: AchievementTree[] = [];
      for (const element of data) {
        let _tmp: UserProcessAchievementTree[] = [];
        for (const pr of element.userProcesses) {
          if (pr.userId === userId) {
            _tmp.push(pr);
          }
        }

        const _tempAchievementTree = new AchievementTree();
        Object.assign(_tempAchievementTree, element);
        _tempAchievementTree.userProcesses = _tmp;
        tmp.push(_tempAchievementTree);
      }
      filteredData = tmp;
    }

    // Paginate filtered data
    const paginatedData = filteredData.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit),
    };
  }

  async getDetailsAchievementTree(id: number): Promise<AchievementTree> {
    return await this.repository.findOne({
      where: { id },
      relations: ['userProcesses', 'milestones'],
    });
  }

  async deleteAchievementTree(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
