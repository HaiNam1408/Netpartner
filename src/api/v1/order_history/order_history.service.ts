import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usersWithManagerInfo } from 'src/api/utils/getInfo.utils';
import { PaginatedResult, PaginationOptions, PaginationService } from 'src/global/globalPagination';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';
import { Users } from 'src/typeorm/entities/users';
import { Between, FindOptionsWhere, In, Like, Repository } from 'typeorm';

@Injectable()
export class OrderHistoryService {
    constructor(
        @InjectRepository(OrderHistoryCustomer)
        private orderHistoryRepository: Repository<OrderHistoryCustomer>,
        private globalRecusive: GlobalRecusive,
        @InjectRepository(Users)
        private usersRepository:Repository<Users>
    ) {}

    async getRegisterCustomer(
        options: PaginationOptions & {
            keyword?: string,
            dateRange?: [Date, Date],
          },
        user_code?: string
  ): Promise<any> {
      const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
      const allUserCodes = user_code ? [user_code, ...subordinateUserCodes] : subordinateUserCodes;
     
      let where: FindOptionsWhere<any> = {
          user_manager: In(allUserCodes)
      };
      const orderBy = { closeTime: 'DESC' };
      if (options.keyword && options.keyword.trim() !== "") {
        const searchText = options.keyword.trim();
        where = [
          { CrawlFrom: Like(`%${searchText}%`) },
          { user_manager: Like(`%${searchText}%`) },
          { email: Like(`%${searchText}%`) }

        ];
        }
      //Xử lý lọc theo khoảng ngày
      if (options.dateRange && options.dateRange.length === 2) {
        const [startDate, endDate] = options.dateRange;
        where.closeTime = Between(startDate, endDate)
        }
        
      if (where.user_manager) {
          where.user_manager = In(allUserCodes);
      }
  
      const paginatedResult = await PaginationService.paginate(
          this.orderHistoryRepository,
          options,
          where,
          [],
          {},
          orderBy
      );
      
      const result = await usersWithManagerInfo<OrderHistoryCustomer>({ data: paginatedResult.data },this.usersRepository);
      const totals = result.reduce((acc, item) => {
        acc.profit += Number(item.profit) || 0;
        acc.swap += Number(item.swaps) || 0;
        acc.commission += Number(item.commission) || 0;
        return acc;
      }, { profit: 0, swap: 0, commission: 0 });


      let startDate: Date = options.dateRange ? options.dateRange[0] : new Date();
      let endDate: Date = options.dateRange ? options.dateRange[1] : new Date();
      
      const {
        totalLots,
        totalClose,
        totalSwaps,
        totalTaxes,
      } = await this.orderHistoryRepository
        .createQueryBuilder('orderHistory')
          .select('SUM(orderHistory.volume)', 'totalLots')
        .addSelect('SUM(orderHistory.swaps)', 'totalSwaps')
        .addSelect('SUM(orderHistory.taxes)', 'totalTaxes')
          .where('orderHistory.closeTime BETWEEN :start AND :end', { start: startDate, end: endDate })
        .getRawOne();

      const statistic = {
        totalLots: totalLots || 0,
        totalClose: 0,
        totalSwaps: totalSwaps || 0,
        totalTaxes: totalTaxes || 0,
      };

      return {
          ...paginatedResult,
          statistic,
          data: result,
          totals,
      };
  }

  async sactisticRegisterCustomer() {
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

    const {
      totalLots,
      totalClose,
      totalSwaps,
      totalTaxes,
    } = await this.orderHistoryRepository
      .createQueryBuilder('orderHistory')
        .select('SUM(orderHistory.volume)', 'totalLots')
      .addSelect('COUNT(orderHistory.id)', 'totalClose')
      .addSelect('SUM(orderHistory.swaps)', 'totalSwaps')
      .addSelect('SUM(orderHistory.taxes)', 'totalTaxes')
      .where('orderHistory.closeTime BETWEEN :start AND :end', { start: currentMonthStart, end: currentMonthEnd })
      .getRawOne();

    return {
      totalLots: totalLots || 0,
      totalClose: totalClose || 0,
      totalSwaps: totalSwaps || 0,
      totalTaxes: totalTaxes || 0,
    };
  }
}