import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Commissions } from 'src/typeorm/entities/commissions';
import { Customers } from 'src/typeorm/entities/Customers';
import { OrderHistoryCustomer } from 'src/typeorm/entities/order_history';
import { Users } from 'src/typeorm/entities/users';
import { Between, In, Repository } from 'typeorm';

@Injectable()
export class DataUserService {
    constructor(
        @InjectRepository(Customers)
        private customersRepository : Repository<Customers>,
        @InjectRepository(Commissions)
        private commissionRepository: Repository<Commissions>,
        @InjectRepository(OrderHistoryCustomer)
        private orderHistoryRepository: Repository<OrderHistoryCustomer>,
        private globalRecusive: GlobalRecusive,
    ){}
    async getMonthRange():Promise<{startOfMonth:Date,endOfMonth:Date}> {
        const currentDate = new Date();
        const targetMonth = currentDate.getMonth() + 1;
        const targetYear = currentDate.getFullYear();
        return {
            startOfMonth: new Date(targetYear, targetMonth - 1, 1),
            endOfMonth: new Date(targetYear, targetMonth, 0)
        };
    }

    async top5UserHaveProfitHigh( subordinateUserCodes:any, startDate?:Date, endDate?:Date ):Promise<Commissions[]>{
        if(subordinateUserCodes && subordinateUserCodes.length > 0){
            return await this.commissionRepository
                .createQueryBuilder('commission')
                .leftJoin('Users', 'user', 'commission.user_manager = user.user_code')
                .select('commission.user_manager', 'user_code')
                .addSelect('user.fullname', 'fullname')
                .addSelect('SUM(commission.profit)', 'total_profit')
                .where('commission.user_manager IN (:...subordinateUserCodes)', { subordinateUserCodes })
                .andWhere('commission.create_at BETWEEN :startDate AND :endDate', { startDate, endDate })
                .groupBy('commission.user_manager, user.fullname')
                .orderBy('total_profit', 'DESC')
                .limit(5)
                .getRawMany();
        }
    }

    async top5UserHaveCustomerHigh(subordinateUserCodes:any, startDate?:Date, endDate?:Date ):Promise<Customers[]>{
        if(subordinateUserCodes && subordinateUserCodes.length > 0){
            return await this.customersRepository
                .createQueryBuilder('customers')
                .leftJoin('Users', 'user', 'customers.saler = user.user_code')
                .select('customers.saler', 'user_code')
                .addSelect('user.fullname', 'fullname')
                .addSelect('COUNT(customers.saler)', 'total_customer')
                .where('customers.saler IN (:...subordinateUserCodes)', { subordinateUserCodes })
                .andWhere('customers.create_at BETWEEN :startDate AND :endDate', { startDate, endDate })
                .groupBy('customers.saler, user.fullname')
                .orderBy('total_customer', 'DESC')
                .limit(5)
                .getRawMany();
        }
        
    }

    async top5CustomerHaveProfitHigh( subordinateUserCodes:any, startDate?:Date, endDate?:Date, user_code?:string ):Promise<Commissions[]>{
        let query = this.orderHistoryRepository
                .createQueryBuilder('order_history_customer')
                .select('order_history_customer.login', 'account')
                .addSelect('order_history_customer.mgrDisplayName', 'fullname')
                .addSelect('order_history_customer.user_manager', 'user_manager')
                .addSelect('SUM(order_history_customer.volume)', 'total_volume')
                .where('order_history_customer.closeTime BETWEEN :startDate AND :endDate', { startDate, endDate });

        if (subordinateUserCodes && subordinateUserCodes.length > 0) {
            // Trường hợp có subordinateUserCodes
            query = query
                .andWhere('order_history_customer.user_manager IN (:...subordinateUserCodes)', { subordinateUserCodes })
                .groupBy('order_history_customer.login, order_history_customer.mgrDisplayName, order_history_customer.user_manager')
                .addOrderBy('total_volume', 'DESC')
                .limit(5);
        } else if (user_code) {
            // Trường hợp subordinateUserCodes rỗng và có user_code
            query = query
                .andWhere('order_history_customer.user_manager = :user_code', { user_code })
                .groupBy('order_history_customer.login, order_history_customer.mgrDisplayName, order_history_customer.user_manager')
                .orderBy('total_volume', 'DESC')
                .limit(5);
        }

        const results = await query.getRawMany();

        return results;
    }

    async top5Table(user_code:string,dateRange?:[Date,Date]):Promise<any>{
        try {
            const { startOfMonth, endOfMonth } = dateRange 
            ? { startOfMonth: dateRange[0], endOfMonth: dateRange[1] } 
            : await this.getMonthRange();

            const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);
            console.log(subordinateUserCodes);
            const top5UserHaveProfitHigh = await this.top5UserHaveProfitHigh(
                subordinateUserCodes, 
                startOfMonth, 
                endOfMonth
            );

            const top5UserHaveCustomerHigh = await this.top5UserHaveCustomerHigh(
                subordinateUserCodes, 
                startOfMonth, 
                endOfMonth
            );

            const top5CustomerHaveProfitHigh = await this.top5CustomerHaveProfitHigh(
                subordinateUserCodes, 
                startOfMonth, 
                endOfMonth,
                user_code
            );

            return {
                top5UserHaveProfitHigh: top5UserHaveProfitHigh? Object.values(top5UserHaveProfitHigh):[],
                top5UserHaveCustomerHigh: top5UserHaveCustomerHigh? Object.values(top5UserHaveCustomerHigh):[],
                top5CustomerHaveProfitHigh: Object.values(top5CustomerHaveProfitHigh),
              };
        } catch (error) {
            throw new Error(error.message)
        }
        
    }

    async listCommissionBranch(user_code: string, dateRange?: [Date, Date]): Promise<any> {
        const { startOfMonth, endOfMonth } = dateRange
            ? { startOfMonth: dateRange[0], endOfMonth: dateRange[1] }
            : await this.getMonthRange();
    
        const subordinateUserCodes = await this.globalRecusive.getAllSubordinateUserCodes(user_code);

        if (subordinateUserCodes && subordinateUserCodes.length > 0) {
            return await this.commissionRepository
                .createQueryBuilder('commission')
                .leftJoin('Users', 'user', 'commission.user_manager = user.user_code')
                .leftJoin('Branching', 'branching', 'branching.userId = user.id')
                .leftJoin('Branches', 'branch', 'branch.id = branching.branchId')
                .select('branch.name', 'branch_name')
                .addSelect('SUM(commission.profit)', 'total_profit')
                .where('commission.user_manager IN (:...subordinateUserCodes)', { subordinateUserCodes })
                .andWhere('commission.create_at BETWEEN :startDate AND :endDate', { startDate: startOfMonth, endDate: endOfMonth })
                .groupBy('branch.name')
                .orderBy('total_profit', 'DESC')
                .getRawMany();
        }
    }
}
