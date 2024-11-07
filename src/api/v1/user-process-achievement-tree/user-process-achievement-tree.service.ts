import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { PaginatedResult } from 'src/global/globalPagination';
import { UserProcessAchievementTree } from 'src/typeorm/entities/user-process-achievement-tree.entity';
import { CreateUpdateUserProcessAchievementTreeDTO } from './dto/create-update-user-process-achievement-tree.dto';
import { GetAllUserProcessAchievementTreeDTO } from './dto/get-all-user-process-achievement-tree.dto';
import { Cron } from '@nestjs/schedule';
import { Customers } from 'src/typeorm/entities/Customers';
import { Users } from 'src/typeorm/entities/users';
import {
  ACHIEVEMENT_TREE_BASE,
  ACHIEVEMENT_TREE_TYPE,
  CUSTOMER_STATUS,
} from 'src/api/utils/constants';
import { AchievementTree } from '../../../typeorm/entities/achievement-tree.entity';

@Injectable()
export class UserProcessAchievementTreeService {
  constructor(
    @InjectRepository(UserProcessAchievementTree)
    private readonly repository: Repository<UserProcessAchievementTree>,
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(AchievementTree)
    private readonly achievementTreeRepository: Repository<AchievementTree>,
  ) {}

  async createUserProcessAchievementTree(
    dto: CreateUpdateUserProcessAchievementTreeDTO,
  ): Promise<UserProcessAchievementTree> {
    const executeDate = new Date();
    const userProcessAchievementTree = new UserProcessAchievementTree();

    userProcessAchievementTree.achievementTreeId = dto.achievementTreeId;
    userProcessAchievementTree.userId = dto.userId;
    userProcessAchievementTree.createAt = executeDate;
    userProcessAchievementTree.updateAt = executeDate;

    return await this.repository.save(userProcessAchievementTree);
  }

  async updateUserProcessAchievementTree(
    dto: CreateUpdateUserProcessAchievementTreeDTO,
    id: number,
  ): Promise<any> {
    return this.repository.update(id, dto);
  }

  async getAllUserProcessAchievementTrees(
    dto: GetAllUserProcessAchievementTreeDTO,
  ): Promise<PaginatedResult<UserProcessAchievementTree>> {
    const { page, limit, userId } = dto;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      where: {
        userId,
      },
      take: limit,
      skip,
      relations: ['achievementTree'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDetailsUserProcessAchievementTree(
    id: number,
  ): Promise<UserProcessAchievementTree> {
    return await this.repository.findOne({
      where: { id },
      relations: ['achievementLogs', 'achievementTree'],
    });
  }

  async deleteUserProcessAchievementTree(id: number): Promise<any> {
    return this.repository.delete(id);
  }

  // Cron job to run every day at 23:00 (11:00 PM)
  @Cron('0 0 23 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCronUserProcessPerDay() {
    const tagRegisterCustomer =
      (CUSTOMER_STATUS.indexOf('Đã đăng ký') || 0) + 1;

    // Set up date ranges
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const startOfMonth = new Date(year, month, 1);
    const startOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const isLastDayOfMonth = now.getDate() === lastDayOfMonth;
    const isLastMonthOfYear = month + 1 === 12 && isLastDayOfMonth;

    // Load achievement trees
    const [
      registerCusTreeMonth,
      registerCusTreeYear,
      netDepTreeMonth,
      netDepTreeYear,
      lotTreeMonth,
      lotTreeYear,
    ] = await this.loadAchievementTrees();

    // Crawl registered customers
    const customerCrawled = await this.getCustomerCrawled(
      tagRegisterCustomer,
      startOfMonth,
      startOfNextMonth,
    );
    const salerCounts = this.countCustomersByField(customerCrawled, 'saler');
    const marketerCounts = this.countCustomersByField(
      customerCrawled,
      'maketer',
    );

    // Process achievements for each saler and marketer
    await Promise.all([
      ...(await this.processCustomerAchievements(
        salerCounts,
        registerCusTreeMonth,
        registerCusTreeYear,
        isLastDayOfMonth,
        isLastMonthOfYear,
      )),
      ...(await this.processCustomerAchievements(
        marketerCounts,
        registerCusTreeMonth,
        registerCusTreeYear,
        isLastDayOfMonth,
        isLastMonthOfYear,
      )),
    ]);

    // Crawl NET DEP and LOT
    const customerDepLotCrawled = await this.getCustomerDepLotCrawled(
      startOfMonth,
      startOfNextMonth,
    );
    const salerDepLotCounts = this.countDepLotBySaler(customerDepLotCrawled);

    for (const [saler, counts] of Object.entries(salerDepLotCounts)) {
      const user = await this.userRepository.findOne({
        where: { user_code: saler },
        select: ['id'],
      });

      if (!user) continue;

      await this.processNetAchievement(
        user.id,
        counts.depCounts,
        netDepTreeMonth,
        netDepTreeYear,
        isLastDayOfMonth,
        isLastMonthOfYear,
      );
      await this.processLotAchievement(
        user.id,
        counts.lotCounts,
        lotTreeMonth,
        lotTreeYear,
        isLastDayOfMonth,
        isLastMonthOfYear,
      );
    }

    // Reset achievements if it's the last day of the month/year
    if (isLastDayOfMonth) {
      await this.resetMonthlyAchievements();
      if (isLastMonthOfYear) {
        await this.resetYearlyAchievements();
      }
    }
  }

  private async loadAchievementTrees() {
    return Promise.all([
      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.REGISTER_USER,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'Khách hàng đã đăng ký',
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.REGISTER_USER,
        })),

      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.REGISTER_USER,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'Khách hàng đã đăng ký',
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.REGISTER_USER,
        })),

      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.DEP,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'NET Dep',
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.DEP,
        })),

      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.DEP,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'NET Dep',
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.DEP,
        })),

      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.LOT,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'LOT',
          typeTree: ACHIEVEMENT_TREE_TYPE.MONTH,
          baseTree: ACHIEVEMENT_TREE_BASE.LOT,
        })),

      (await this.achievementTreeRepository.findOne({
        where: {
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.LOT,
        },
      })) ??
        (await this.achievementTreeRepository.save({
          nameTree: 'LOT',
          typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
          baseTree: ACHIEVEMENT_TREE_BASE.LOT,
        })),
    ]);
  }

  private async getCustomerCrawled(
    tagRegisterCustomer: number,
    startOfMonth: Date,
    startOfNextMonth: Date,
  ) {
    return this.customerRepository.find({
      where: {
        tag: `${tagRegisterCustomer}`,
        saler: Not(IsNull()),
        maketer: Not(IsNull()),
        create_at: Between(startOfMonth, startOfNextMonth),
      },
      select: ['saler', 'maketer'],
    });
  }

  private countCustomersByField(
    customers: Array<{ saler: string; maketer: string }>,
    field: 'saler' | 'maketer',
  ) {
    return customers.reduce<{ [key: string]: number }>((acc, customer) => {
      const key = customer[field];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  private async processCustomerAchievements(
    counts: { [key: string]: number },
    registerCusTreeMonth: any,
    registerCusTreeYear: any,
    isLastDayOfMonth: boolean,
    isLastMonthOfYear: boolean,
  ) {
    return Object.entries(counts).map(([key, count]) =>
      this.processRegisterCustomerAchievement(
        key,
        count,
        registerCusTreeMonth,
        registerCusTreeYear,
        isLastDayOfMonth,
        isLastMonthOfYear,
      ),
    );
  }

  private async getCustomerDepLotCrawled(
    startOfMonth: Date,
    startOfNextMonth: Date,
  ) {
    return this.customerRepository.find({
      where: {
        saler: Not(IsNull()),
        create_at: Between(startOfMonth, startOfNextMonth),
      },
      select: ['saler', 'net_dep', 'lot'],
    });
  }

  private countDepLotBySaler(
    customers: Array<{ saler: string; net_dep: number; lot: number }>,
  ) {
    return customers.reduce<{
      [saler: string]: { depCounts: number; lotCounts: number };
    }>((acc, customer) => {
      const { saler, net_dep, lot } = customer;
      if (!acc[saler]) {
        acc[saler] = { depCounts: 0, lotCounts: 0 };
      }
      acc[saler].depCounts += net_dep || 0;
      acc[saler].lotCounts += lot || 0;
      return acc;
    }, {});
  }

  private async resetMonthlyAchievements() {
    await Promise.all([
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.MONTH,
        ACHIEVEMENT_TREE_BASE.REGISTER_USER,
      ),
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.MONTH,
        ACHIEVEMENT_TREE_BASE.LOT,
      ),
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.MONTH,
        ACHIEVEMENT_TREE_BASE.DEP,
      ),
    ]);
  }

  private async resetYearlyAchievements() {
    await Promise.all([
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.YEAR,
        ACHIEVEMENT_TREE_BASE.REGISTER_USER,
      ),
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.YEAR,
        ACHIEVEMENT_TREE_BASE.LOT,
      ),
      this.resetAchievementValues(
        ACHIEVEMENT_TREE_TYPE.YEAR,
        ACHIEVEMENT_TREE_BASE.DEP,
      ),
    ]);
  }

  async processNetAchievement(
    userId: number,
    count: number,
    treeMonth: AchievementTree,
    treeYear: AchievementTree,
    isLastDayOfMonth: boolean,
    isLastMonthOfYear: boolean,
  ) {
    // Update monthly achievement
    let [existedDepUserProcessTreeMonth, existedDepUserProcessTreeYear] =
      await Promise.all([
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: treeMonth.id,
          },
        }),
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: treeYear.id,
          },
        }),
      ]);

    if (existedDepUserProcessTreeMonth) {
      await this.repository.update(existedDepUserProcessTreeMonth.id, {
        value: count,
      });
    } else {
      const tmp = this.repository.create({
        value: count,
        userId,
        achievementTreeId: treeMonth.id,
      });
      existedDepUserProcessTreeMonth = await this.repository.save(tmp);
    }

    if (isLastDayOfMonth) {
      // Update yearly achievement
      if (existedDepUserProcessTreeYear) {
        await this.repository.update(existedDepUserProcessTreeYear.id, {
          value: existedDepUserProcessTreeYear.value + count,
        });
      } else {
        const temp = this.repository.create({
          value: count,
          userId,
          achievementTreeId: treeYear.id,
        });
        existedDepUserProcessTreeYear = await this.repository.save(temp);
      }

      // Reset monthly value
      await this.repository.update(existedDepUserProcessTreeMonth.id, {
        value: 0,
      });

      if (isLastMonthOfYear) {
        await this.repository.update(existedDepUserProcessTreeYear.id, {
          value: 0,
        });
      }
    }
  }

  async processLotAchievement(
    userId: number,
    count: number,
    lotTreeMonth: AchievementTree,
    lotTreeYear: AchievementTree,
    isLastDayOfMonth: boolean,
    isLastMonthOfYear: boolean,
  ) {
    // Update monthly achievement

    let [existedLotUserProcessTreeMonth, existedLotUserProcessTreeYear] =
      await Promise.all([
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: lotTreeMonth.id,
          },
        }),
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: lotTreeYear.id,
          },
        }),
      ]);

    if (existedLotUserProcessTreeMonth) {
      await this.repository.update(existedLotUserProcessTreeMonth.id, {
        value: count,
      });
    } else {
      const tmp = this.repository.create({
        value: count,
        userId,
        achievementTreeId: lotTreeMonth.id,
      });
      existedLotUserProcessTreeMonth = await this.repository.save(tmp);
    }

    if (isLastDayOfMonth) {
      // Update yearly achievement
      if (existedLotUserProcessTreeYear) {
        await this.repository.update(existedLotUserProcessTreeYear.id, {
          value: existedLotUserProcessTreeYear.value + count,
        });
      } else {
        const temp = this.repository.create({
          value: count,
          userId,
          achievementTreeId: lotTreeYear.id,
        });
        existedLotUserProcessTreeYear = await this.repository.save(temp);
      }

      // Reset monthly value
      await this.repository.update(existedLotUserProcessTreeMonth.id, {
        value: 0,
      });

      if (isLastMonthOfYear) {
        await this.repository.update(existedLotUserProcessTreeYear.id, {
          value: 0,
        });
      }
    }
  }

  async processRegisterCustomerAchievement(
    userCode: string,
    count: number,
    achievementTreeMonth: AchievementTree,
    achievementTreeYear: AchievementTree,
    isLastDayOfMonth: boolean,
    isLastMonthOfYear: boolean,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_code: userCode },
      select: ['id'],
    });

    if (!user) return;

    const userId = user.id;

    let [existedUserProcessTreeMonth, existedUserProcessTreeYear] =
      await Promise.all([
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: achievementTreeMonth.id,
          },
        }),
        this.repository.findOne({
          where: {
            userId,
            achievementTreeId: achievementTreeYear.id,
          },
        }),
      ]);

    // Update monthly achievement
    if (existedUserProcessTreeMonth) {
      await this.repository.update(existedUserProcessTreeMonth.id, {
        value: count,
      });
    } else {
      const tmp = this.repository.create({
        value: count,
        userId,
        achievementTreeId: achievementTreeMonth.id,
      });
      existedUserProcessTreeMonth = await this.repository.save(tmp);
    }

    if (isLastDayOfMonth) {
      // Update yearly achievement
      if (existedUserProcessTreeYear) {
        await this.repository.update(existedUserProcessTreeYear.id, {
          value: existedUserProcessTreeYear.value + count,
        });
      } else {
        const temp = this.repository.create({
          value: count,
          userId,
          achievementTreeId: achievementTreeYear.id,
        });
        existedUserProcessTreeYear = await this.repository.save(temp);
      }

      // Reset monthly value
      await this.repository.update(existedUserProcessTreeMonth.id, {
        value: 0,
      });

      if (isLastMonthOfYear) {
        await this.repository.update(existedUserProcessTreeYear.id, {
          value: 0,
        });
      }
    }
  }

  async resetAchievementValues(typeTree: number, baseTree: number) {
    // Fetch records that match the given typeTree and baseTree
    const records = await this.repository.find({
      where: {
        achievementTree: {
          typeTree: typeTree,
          baseTree: baseTree,
        },
      },
      relations: ['achievementTree'],
      select: ['id', 'value', 'userId', 'achievementTreeId', 'achievementTree'],
    });

    for (const record of records) {
      // Process yearly updates only for monthly records
      if (typeTree === ACHIEVEMENT_TREE_TYPE.MONTH) {
        const yearRecord = await this.repository.findOne({
          where: {
            userId: record.userId,
            achievementTree: {
              typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
              baseTree: record.achievementTree.baseTree,
            },
          },
        });

        // Update or create the yearly record
        if (yearRecord) {
          await this.repository.update(yearRecord.id, {
            value: yearRecord.value + record.value,
          });
        } else {
          const yearTreeInfo = await this.achievementTreeRepository.findOne({
            where: {
              typeTree: ACHIEVEMENT_TREE_TYPE.YEAR,
              baseTree: record.achievementTree.baseTree,
            },
            select: ['id'],
          });

          if (yearTreeInfo) {
            await this.repository.save({
              value: record.value,
              userId: record.userId,
              achievementTreeId: yearTreeInfo.id,
              createAt: new Date(),
              updateAt: new Date(),
            });
          }
        }
      }

      // Reset the monthly record's value to zero
      await this.repository.update(record.id, { value: 0 });
    }
  }
}
