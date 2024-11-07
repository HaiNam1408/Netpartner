import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Commissions } from 'src/typeorm/entities/commissions';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Commissions)
    private commissionRepository: Repository<Commissions>,
    @InjectRepository(OrderHistoryCustomer)
    private orderHistoryRepository: Repository<OrderHistoryCustomer>,
    @InjectRepository(RegisteredCustomer)
    private registeredRepository: Repository<RegisteredCustomer>,
    private globalRecusive: GlobalRecusive,
  ) {}

  async getPersonalOverview(user_code: string, start_at?: Date, end_at?: Date) {
    const dateCondition: any = {};
    if (start_at) {
      dateCondition['$gte'] = start_at;
    }
    if (end_at) {
      dateCondition['$lte'] = end_at;
    }

    // Thêm điều kiện thời gian vào các truy vấn
    const totalCommission = await this.commissionRepository
      .createQueryBuilder('commissions')
      .where('commissions.user_manager = :user_code', { user_code })
      .andWhere(start_at || end_at ? 'commissions.create_at BETWEEN :start AND :end' : '1=1', {
        start: start_at,
        end: end_at,
      })
      .select('SUM(commissions.profit)', 'totalProfit')
      .getRawOne();

    const totalVolume = await this.orderHistoryRepository
      .createQueryBuilder('orderHistory')
      .where('orderHistory.user_manager = :user_code', { user_code })
      .andWhere(start_at || end_at ? 'orderHistory.closeTime BETWEEN :start AND :end' : '1=1', {
        start: start_at,
        end: end_at,
      })
      .select('SUM(orderHistory.volume)', 'totalVolume')
      .getRawOne();

    const totalCustomer = await this.registeredRepository
      .createQueryBuilder('registeredCustomer')
      .where('registeredCustomer.user_manager = :user_code', { user_code })
      .andWhere(start_at || end_at ? 'registeredCustomer.createTime BETWEEN :start AND :end' : '1=1', {
        start: start_at,
        end: end_at,
      })
      .select('COUNT(registeredCustomer.user_manager)', 'totalCustomer')
      .getRawOne();

    const netDeposit = await this.registeredRepository
      .createQueryBuilder('registeredCustomer')
      .where('registeredCustomer.user_manager = :user_code', { user_code })
      .andWhere(start_at || end_at ? 'registeredCustomer.createTime BETWEEN :start AND :end' : '1=1', {
        start: start_at,
        end: end_at,
      })
      .select('SUM(registeredCustomer.balance)', 'netDeposit')
      .getRawOne();

    return {
      totalCommission: totalCommission.totalProfit || 0,
      totalOrder: totalVolume.totalVolume || 0,
      totalCustomer: totalCustomer.totalCustomer || 0,
      netDeposit: netDeposit.netDeposit || 0,
    };
  }


  async getOverview(user_code: string) {
    const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    const allUserCodes = [user_code, ...subordinateUserCodes];
    console.log(allUserCodes);
  
    const totalCommission = await this.commissionRepository
      .createQueryBuilder('commissions')
      .where('commissions.user_manager IN (:...allUserCodes)', { allUserCodes })
      .select('SUM(commissions.profit)', 'totalProfit')
      .getRawOne();
  
    const totalVolume = await this.orderHistoryRepository
      .createQueryBuilder('orderHistory')
      .where('orderHistory.user_manager IN (:...allUserCodes)', { allUserCodes })
      .select('SUM(orderHistory.volume)', 'totalVolume')
      .getRawOne();
  
    const totalCustomer = await this.registeredRepository
      .createQueryBuilder('registeredCustomer')
      .where('registeredCustomer.user_manager IN (:...allUserCodes)', { allUserCodes })
      .select('COUNT(registeredCustomer.user_manager)', 'totalCustomer')
      .getRawOne();
  
    const netDeposit = await this.registeredRepository
      .createQueryBuilder('registeredCustomer')
      .where('registeredCustomer.user_manager IN (:...allUserCodes)', { allUserCodes })
      .select('SUM(registeredCustomer.balance)', 'netDeposit')
      .getRawOne();
  
    return {
      totalCommission: totalCommission?.totalProfit || 0,
      totalOrder: totalVolume?.totalVolume || 0,
      totalCustomer: totalCustomer?.totalCustomer || 0,
      netDeposit: netDeposit?.netDeposit || 0,
    };
  }
  
}
