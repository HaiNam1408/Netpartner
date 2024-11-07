import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, Repository } from 'typeorm';
import { CreateLearningPathDto } from './dto/createLearning.dto';
import { LearningPath } from 'src/typeorm/entities/learing-path';
import { LearningItem } from 'src/typeorm/entities/learning-item';
import { Users } from 'src/typeorm/entities/users';
import { KnowledgeTree } from 'src/typeorm/entities/knowledge-tree';
import { UpdateLearningPathDto } from './dto/updateDto.dto';
import { UserProgressTree } from 'src/typeorm/entities/user-progress';

@Injectable()
export class LearningStepService {
  constructor(
    @InjectRepository(LearningPath)
    private learningPathRepository: Repository<LearningPath>,
    @InjectRepository(LearningItem)
    private learningItemRepository: Repository<LearningItem>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(UserProgressTree)
    private userProgressRepository: Repository<UserProgressTree>,
    @InjectRepository(KnowledgeTree)
    private knowledgeTreeRepository: Repository<KnowledgeTree>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  async createLearningPath(
    learningPathData: CreateLearningPathDto,
  ): Promise<LearningPath> {
    const maxOrderEntry = await this.learningPathRepository.findOne({
      where: {},
      order: { order: 'DESC' },
    });

    let maxOrder = maxOrderEntry ? maxOrderEntry.order : 0;

    const newLearningPath = this.learningPathRepository.create({
      ...learningPathData,
      order: maxOrder + 1,
      level: maxOrder + 1,
    });

    await this.learningPathRepository.save(newLearningPath);

    if (learningPathData.items && learningPathData.items.length > 0) {
      let itemOrder = 1;

      const items = learningPathData.items.map((item) => {
        return this.learningItemRepository.create({
          ...item,
          learningPath: newLearningPath,
          order: itemOrder++,
        });
      });

      await this.learningItemRepository.save(items);
    }

    return this.learningPathRepository.findOne({
      where: { id: newLearningPath.id },
      relations: ['items'],
    });
  }

  async updateUserProgress(
    userId: number,
    itemId: number,
    isCompleted: boolean,
  ): Promise<void> {
    // Kiểm tra user tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Kiểm tra item tồn tại
    const item = await this.learningItemRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new Error(`Learning item with id ${itemId} not found`);
    }

    // Lấy toàn bộ cây học tập với tất cả các step và item
    const learningPaths = await this.learningPathRepository.find({
      relations: ['items'],
      where: {
        departmentId: user.departmentId,
      },
    });
    const items = await Promise.all(learningPaths.map((path) => path.items));
    const flattenedItems = items.flat();

    const itemExists = flattenedItems.some((item) => item.id === itemId);

    if (!itemExists) {
      throw new Error('Bạn không thể cập nhật item id không phải của mình');
    }
    if (learningPaths.length === 0) {
      throw new Error('No learning paths found');
    }

    // Tạo một danh sách tất cả các item từ tất cả các step trong tất cả các learning path
    const allItems = learningPaths.flatMap((path) =>
      path.items.flatMap((step) => step),
    );
    // Lấy tất cả progress hiện tại của user cho tất cả các item
    const existingProgresses = await this.userProgressRepository.find({
      where: {
        user: { id: userId },
        learningItem: { id: In(allItems.map((i) => i.id)) },
      },
      relations: ['user', 'learningItem'],
    });

    // Tạo map để dễ dàng kiểm tra và cập nhật
    const progressMap = new Map(
      existingProgresses.map((progress) => [
        progress.learningItem.id,
        progress,
      ]),
    );

    // Cập nhật hoặc tạo mới progress cho mỗi item trong tất cả các step
    const progressesToSave = [];
    for (const item of allItems) {
      let progress = progressMap.get(item.id);
      if (progress) {
        // Nếu là item hiện tại, cập nhật trạng thái
        if (item.id === itemId) {
          progress.isCompleted = isCompleted;
          progress.completedAt = isCompleted ? new Date() : null;
        }
        // Những item khác giữ nguyên trạng thái
      } else {
        // Tạo mới progress nếu chưa tồn tại
        progress = this.userProgressRepository.create({
          user: { id: userId },
          learningItem: { id: item.id },
          isCompleted: item.id === itemId ? isCompleted : false,
          completedAt: item.id === itemId && isCompleted ? new Date() : null,
        });
      }
      progressesToSave.push(progress);
    }

    // Lưu tất cả các progress cùng một lúc
    try {
      await this.userProgressRepository.save(progressesToSave);
    } catch (error) {
      console.error('Error saving progresses:', error);
      throw new Error('Failed to save user progresses');
    }

    // Kiểm tra và cập nhật level của user
    await this.checkAndUpdateUserLevel(userId);
  }

  private async checkAndUpdateUserLevel(userId: number): Promise<void> {
    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'knowledgeTree',
        'progresses',
        'progresses.learningItem',
        'progresses.learningItem.learningPath',
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.knowledgeTree) {
      const newKnowledgeTree = this.knowledgeTreeRepository.create({
        currentLevel: 1,
        user: user,
      });
      await this.knowledgeTreeRepository.save(newKnowledgeTree);
      user.knowledgeTree = newKnowledgeTree;
    }

    // Lấy tất cả các lộ trình học tập, sắp xếp theo level
    const allLearningPaths = await this.learningPathRepository.find({
      relations: ['items'],
      where: { departmentId: user.departmentId },
      order: { level: 'ASC' },
    });

    let newLevel = 1;
    for (const path of allLearningPaths) {
      const allItemsInPathCompleted = path.items.every((item) =>
        user.progresses.some(
          (progress) =>
            progress.learningItem.id === item.id && progress.isCompleted,
        ),
      );

      if (allItemsInPathCompleted) {
        newLevel = Math.max(newLevel, path.level + 1);
      } else {
        break; // Dừng khi gặp lộ trình chưa hoàn thành
      }
    }

    // Cập nhật level mới nếu có thay đổi
    if (newLevel > user.knowledgeTree.currentLevel) {
      user.knowledgeTree.currentLevel = newLevel;
      await this.knowledgeTreeRepository.save(user.knowledgeTree);
    }
  }

  async getUserLearningPaths(userId: number): Promise<any> {
    try {
      // Lấy thông tin người dùng và knowledgeTree của họ
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['knowledgeTree', 'department'],
        select: {
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
          departmentId: true,
        },
      });
      // Kiểm tra xem người dùng hoặc knowledgeTree có tồn tại không
      if (!user) {
        throw new Error('User không tồn tại');
      }
      const check = await this.userProgressRepository.findOne({
        where: {
          user: { id: userId },
        },
      });
      if (!check) {
        const tree = await this.learningPathRepository.find({
          where: {
            departmentId: user.departmentId,
          },
          relations: ['items', 'department', 'items.progresses'],
          order: {
            order: 'asc',
          },
        });
        // Create progress entries for items that don't have them for this user
        for (const path of tree) {
          for (const item of path.items) {
            const newProgress = this.userProgressRepository.create({
              user: { id: userId },
              learningItem: { id: item.id },
              isCompleted: false,
              completedAt: new Date(),
            });
            await this.userProgressRepository.save(newProgress);
          }
        }
        const updatedTree = await this.learningPathRepository.find({
          where: {
            departmentId: user.departmentId,
          },
          relations: ['items', 'department', 'items.progresses'],
          order: {
            order: 'ASC',
          },
        });
        return { tree: updatedTree, user };
      }
      // Truy vấn để lấy tất cả các LearningPath từ level 1 đến level hiện tại của người dùng
      const tree = await this.learningPathRepository.find({
        where: {
          departmentId: user.departmentId,
          items: {
            progresses: {
              user: {
                id: userId,
              },
            },
          },
        },
        order: { level: 'ASC' }, // Sắp xếp theo thứ tự tăng dần của level
        relations: ['items', 'items.progresses'], // Lấy thêm thông tin về items và progresses
      });
      const merge: any = {
        tree,
        user: user,
      };
      return merge;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getLearningPaths(departmentId: number): Promise<LearningPath[]> {
    const learningPaths = await this.learningPathRepository.find({
      order: { level: 'ASC' },
      where: {
        department: {
          id: departmentId,
        },
      },
      relations: ['items', 'department', 'items.progresses'],
    });

    return learningPaths;
  }

  async getLearningPathId(id: number): Promise<LearningPath> {
    return this.learningPathRepository.findOne({
      where: {
        id,
      },
      relations: ['items', 'department', 'items.progresses'],
    });
  }

  async deleteLearningPath(learningPathId: number): Promise<void> {
    const check = await this.learningPathRepository.findOne({
      where: {
        id: learningPathId,
      },
    });
    if (!check) {
      throw new Error('Không tìm thấy id');
    }
    await this.dataSource.transaction(async (manager) => {
      // Tìm learning path
      const learningPath = await manager.findOne(LearningPath, {
        where: { id: learningPathId },
        relations: ['items'],
      });

      if (!learningPath) {
        throw new Error('Learning Path not found');
      }

      const learningItemIds = learningPath.items.map((item) => item.id);

      // 1. Xóa tất cả user progress tree liên quan đến các learning items trong learning path này
      await manager
        .createQueryBuilder()
        .delete()
        .from('user_progress_tree')
        .where('learningItemId IN (:...learningItemIds)', { learningItemIds })
        .execute();

      // 3. Xóa tất cả learning items trong learning path
      await manager
        .createQueryBuilder()
        .delete()
        .from('learning_item')
        .where('id IN (:...learningItemIds)', { learningItemIds })
        .execute();

      // 4. Cuối cùng, xóa Learning Path
      await manager.remove(learningPath);
    });
  }

  async updateLearningPath(
    id: number,
    updateLearningPathDto: UpdateLearningPathDto,
  ): Promise<any> {
    await this.dataSource.transaction(async (manager) => {
      const learningPathRepo = manager.getRepository(LearningPath);
      const learningItemRepo = manager.getRepository(LearningItem);

      let learningPath = await learningPathRepo.findOne({
        where: { id },
        relations: ['items'],
      });
      if (!learningPath) {
        throw new Error(`Learning Path with ID "${id}" not found`);
      }

      // Cập nhật các trường của learning path
      Object.assign(learningPath, updateLearningPathDto);

      // Lưu learning path trước để đảm bảo nó tồn tại trong cơ sở dữ liệu
      learningPath = await learningPathRepo.save(learningPath);
      let maxOrder = Math.max(
        ...learningPath.items.map((item) => item.order),
        0,
      );
      // Cập nhật learning items nếu có
      if (updateLearningPathDto.learningItems) {
        const updatedItems = [];
        for (const itemDto of updateLearningPathDto.learningItems) {
          let item: LearningItem;
          if (itemDto.id) {
            // Tìm item hiện có
            item = await learningItemRepo.findOne({
              where: { id: itemDto.id },
            });
            if (item) {
              // Cập nhật item hiện có
              Object.assign(item, itemDto);
            }
          }
          if (!item) {
            // Tạo mới item nếu không tìm thấy
            item = learningItemRepo.create(itemDto);
            // Gán learning path cho item
            item.learningPath = learningPath;
            item.order = ++maxOrder;
          }

          updatedItems.push(await learningItemRepo.save(item));
        }
        // Cập nhật danh sách items của learning path
        // learningPath.items = updatedItems;
      }

      // Lưu learning path với danh sách items đã cập nhật
      // return learningPathRepo.save(learningPath);
    });
  }

  async deleteItem(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Find the learning item first
      const learningItem = await manager.findOne(LearningItem, {
        where: { id },
      });

      if (!learningItem) {
        throw new Error('Learning Item not found');
      }

      // 1. Delete related user progress tree entries
      await manager
        .createQueryBuilder()
        .delete()
        .from('user_progress_tree')
        .where('learningItemId = :id', { id })
        .execute();

      // 3. Finally, delete the learning item
      await manager.remove(learningItem);
    });
  }
}
