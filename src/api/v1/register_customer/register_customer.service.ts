import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usersWithManagerInfo } from 'src/api/utils/getInfo.utils';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { Customers } from 'src/typeorm/entities/Customers';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';
import { Users } from 'src/typeorm/entities/users';
import {
  Between,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';

@Injectable()
export class RegisterCustomerService {
  constructor(
    @InjectRepository(RegisteredCustomer)
    private registerCustomerRepository: Repository<RegisteredCustomer>,
    private globalRecusive: GlobalRecusive,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
    @InjectRepository(Affiliate)
    private readonly afiliateRepository: Repository<Affiliate>,
  ) {}

  async getRegisterCustomer(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
      saler?: string;
      maketing?: string;
    },
    user_code?: string,
  ): Promise<PaginatedResult<any>> {
    // Retrieve user codes, including the user's code and any subordinate codes
    const subordinateUserCodes =
      await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    const allUserCodes = user_code
      ? [user_code, ...subordinateUserCodes]
      : subordinateUserCodes;

    // Initialize `where` to enforce `tag = '8'` and set `saler` condition
    let where: FindOptionsWhere<any> = {
      tag: '8',
      isExamine: true,
      saler: In(allUserCodes),
    };

    // Apply keyword search if provided
    if (options.keyword?.trim()) {
      const searchText = options.keyword.trim();
      where = [
        { ...where, CrawlFrom: Like(`%${searchText}%`) },
        { ...where, saler: Like(`%${searchText}%`) },
        { ...where, fullname: Like(`%${searchText}%`) },
        { ...where, email: Like(`%${searchText}%`) },
        { ...where, phone: Like(`%${searchText}%`) },
      ];
    }

    // Apply date range condition if specified
    if (options.dateRange?.length === 2) {
      var [startDate, endDate] = options.dateRange;
      where = where.map((condition) => ({
        ...condition,
        create_at: Between(startDate, endDate),
      }));
    }

    // Apply `saler` filter if provided
    if (options.saler) {
      where = where.map((condition) => ({
        ...condition,
        saler: options.saler,
      }));
    }

    // Apply `maketing` filter if provided
    if (options.maketing) {
      where = where.map((condition) => ({
        ...condition,
        maketer: options.maketing,
      }));
    }

    // Set order by `create_at` descending
    const orderBy = { create_at: 'DESC' };

    // Execute paginated query
    const paginatedResult = await PaginationService.paginate(
      this.customerRepository,
      options,
      where,
      [],
      {},
      orderBy,
    );

    // Aggregate counts with relevant filters
    const [totalUserRegister, totalUserMaketing, totalSelf] = await Promise.all(
      [
        this.customerRepository.count({
          where: { tag: '8', create_at: Between(startDate, endDate) },
        }),
        this.customerRepository.count({
          where: {
            tag: '8',
            maketer: Not(IsNull()),
            create_at: Between(startDate, endDate),
          },
        }),
        this.customerRepository.count({
          where: {
            tag: '8',
            saler: user_code,
            create_at: Between(startDate, endDate),
          },
        }),
      ],
    );

    // Construct additional index info
    const sectionTotalIndex = {
      totalUserRegister,
      totalUserMaketing,
      totalSelf,
    };

    // Fetch additional user info for the results
    const result = await usersWithManagerInfo<Customers>(
      { data: paginatedResult.data },
      this.usersRepository,
    );

    // Attach the section total index to the result data
    return {
      ...paginatedResult,
      data: { ...result },
      ...sectionTotalIndex,
    };
  }

  async sactisticRegisterCustomer() {
    const totalCustomers = await this.registerCustomerRepository.count({
      where: { user_manager: Not(IsNull()) },
    });

    // Get approached customers with tags '1' and '2' and '6'
    const approachedCustomers = await this.customerRepository.count({
      where: [{ tag: '1' }, { tag: '2' }, { tag: '6' }, { tag: '7' }],
    });
    const approachedRate = (approachedCustomers / totalCustomers) * 100;

    // Get total affiliate usage
    const totalAffiliateUsage = await this.afiliateRepository
      .createQueryBuilder('affiliate')
      .select('SUM(affiliate.total_usage)', 'total')
      .getRawOne();

    const totalUsage = totalAffiliateUsage ? totalAffiliateUsage.total : 0;
    // Get registered customers count and calculate conversion rate
    const registeredCustomers = await this.customerRepository.count({
      where: [{ tag: '7' }],
    });
    const conversionRate =
      registeredCustomers > 0
        ? (registeredCustomers / totalCustomers) * 100
        : 0;

    // Get customers with deposit count
    const customersWithDeposit = await this.registerCustomerRepository
      .createQueryBuilder('registered_customer')
      .select('COUNT(DISTINCT registered_customer.id)', 'count') // Assuming 'id' is the unique identifier for deposits
      .where('registered_customer.balance > 0')
      .getRawOne();

    const newCustomersWithDeposit = customersWithDeposit
      ? parseInt(customersWithDeposit.count, 10)
      : 0;
    const investmentRate =
      (newCustomersWithDeposit / registeredCustomers) * 100;

    return {
      totalCustomers,
      approachedRate,
      conversionRate,
      investmentRate,
    };
  }
}
