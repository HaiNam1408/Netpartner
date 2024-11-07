import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usersWithManagerInfo } from 'src/api/utils/getInfo.utils';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Users } from 'src/typeorm/entities/users';
import { Between, FindOptionsWhere, In, Like, Raw, Repository } from 'typeorm';
import { CreateCommissionDto } from './dto/createCommission.dto';
import { CommissionCrawlFrom } from 'src/typeorm/enum/commission.enum';
import { Readable } from 'typeorm/platform/PlatformTools';
import * as csvParser from 'csv-parser';


@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commissions)
    private commissionRepository: Repository<Commissions>,
    private globalRecusive: GlobalRecusive,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async importFromCSV(csvBuffer: Buffer): Promise<void> {
    try {
      const stream = Readable.from(csvBuffer.toString());
      const parser = stream.pipe(csvParser());
      const commissionsList: Commissions[] = [];

      for await (const row of parser) {
        const commission = new Commissions();
        commission.trading_id = row.trading_id;
        commission.user_manager = row.user_manager;
        commission.order = row.order;
        commission.tradingAccount = parseInt(row.tradingAccount, 10);
        commission.ib = parseInt(row.ib, 10);
        commission.time = row.time;
        commission.type = row.type;
        commission.rebate = parseFloat(row.rebate);
        commission.note = row.note;
        commission.level = row.level;
        commission.partner = row.partner;
        commission.crawlFrom = row.crawlFrom;
        commission.profit = parseFloat(row.profit);

        // Validate numeric fields
        if (
          isNaN(commission.tradingAccount) ||
          isNaN(commission.ib) ||
          isNaN(commission.rebate) ||
          isNaN(commission.profit)
        ) {
          throw new Error(`Invalid numeric data in row: ${JSON.stringify(row)}`);
        }

        commissionsList.push(commission);
      }

      // Save data in chunks to manage memory usage
      const chunkSize = 1000;
      for (let i = 0; i < commissionsList.length; i += chunkSize) {
        const chunk = commissionsList.slice(i, i + chunkSize);
        await this.commissionRepository.save(chunk);
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      throw new Error(`Failed to process CSV file: ${error.message}`);
    }
  }

  async createCommissions(data: CreateCommissionDto[]): Promise<any> {
    try {
      const commissionCreates = data.map((commission) =>
        this.commissionRepository.create({
          ...commission,
        }),
      );
      return await this.commissionRepository.insert(commissionCreates);
    } catch (error) {
      throw new Error(`Lỗi tạo commissions: ${error.message}`);
    }
  }

  async updateCommission(
    id: number,
    updateCommissionDto: Partial<CreateCommissionDto>,
  ): Promise<void> {
    // Kiểm tra xem commission cần cập nhật có tồn tại không
    const existingCommission = await this.commissionRepository.findOne({
      where: { id },
    });
    if (!existingCommission) {
      throw new Error('Commission không tồn tại');
    }

    // Cập nhật commission
    await this.commissionRepository.update(id, {
      ...updateCommissionDto,
    });
  }

  async deleteCommission(id: number): Promise<void> {
    const existingCommission = await this.commissionRepository.findOne({
      where: { id },
    });
    if (!existingCommission) {
      throw new Error('Commission không tồn tại');
    }
    await this.commissionRepository.delete({ id });
  }

  async getAllCommissions(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
    },
    user_code?: string
  ): Promise<any> {
    const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    const allUserCodes = user_code ? [user_code, ...subordinateUserCodes] : subordinateUserCodes;
  
    let where: FindOptionsWhere<any> = {
      user_manager: In(allUserCodes),
    };

    const orderBy = { create_at: 'DESC' };
  
    if (options.keyword?.trim()) {
      const searchText = `%${options.keyword.trim()}%`;
      where = [
        { CrawlFrom: Like(searchText) },
        { user_manager: Like(searchText) },
        { login: Like(searchText) },
        { deal: Like(searchText) },
      ];
    }
  
    if (options.dateRange?.length === 2) {
      const [startDate, endDate] = options.dateRange;
      where = {
        ...where,
        time: Between(startDate, endDate),
      };
    }
  
    // Ensure user_manager is always filtered by allUserCodes
    where = Array.isArray(where)
      ? [{ user_manager: In(allUserCodes) }, ...where]
      : { ...where, user_manager: In(allUserCodes) };
  
    const paginatedResult = await PaginationService.paginate(
      this.commissionRepository,
      options,
      where,
      [],
      {},
      orderBy
    );
  
    const totalRebate = paginatedResult.data.reduce((sum: number, cur: any) => sum + (cur.ib || 0), 0);
  
    const result = await usersWithManagerInfo<Commissions>(
      { data: paginatedResult.data },
      this.usersRepository
    );
  
    return {
      ...paginatedResult,
      data: {
        result,
        totalRebate,
      },
    };
  }

  async getUserCommissions(
    user_code: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    let where: FindOptionsWhere<any> = {
      user_manager: user_code,
    };

    const orderBy = { create_at: 'DESC' };

    const paginatedResult = await PaginationService.paginate(
      this.commissionRepository,
      { limit, page },
      where,
      [],
      {},
      orderBy,
    );

    const result = await usersWithManagerInfo<Commissions>(
      { data: paginatedResult.data },
      this.usersRepository,
    );

    return {
      ...paginatedResult,
      data: result,
    };
  }
}
