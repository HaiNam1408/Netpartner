import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usersWithManagerInfo } from 'src/api/utils/getInfo.utils';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Customers } from 'src/typeorm/entities/Customers';
import { DepositedCustomer } from 'src/typeorm/entities/deposited';
import { Users } from 'src/typeorm/entities/users';
import {
  Between,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

@Injectable()
export class DepositedService {
  constructor(
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>,
    private globalRecusive: GlobalRecusive,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(DepositedCustomer)
    private depositedCustomerRepository: Repository<DepositedCustomer>,
  ) {}

  async createDepositedCustomerFromCSV(
    csvBuffer: Buffer,
  ): Promise<void> {
    try {
      const stream = Readable.from(csvBuffer.toString());
      const parser = stream.pipe(csvParser());
      const depositedCustomerList: DepositedCustomer[] = [];

      for await (const row of parser) {
        const depositedCustomer = new DepositedCustomer();
        depositedCustomer.trading_id = row.trading_id;
        depositedCustomer.orderId = row.orderId;
        depositedCustomer.serialNumber = row.serialNumber;
        depositedCustomer.type = row.type;
        depositedCustomer.currency = row.currency;
        depositedCustomer.email = row.email;
        depositedCustomer.tradeLoginId = row.tradeLoginId;
        depositedCustomer.name = row.name;
        depositedCustomer.platform = parseInt(row.platform);
        depositedCustomer.createTradeAccountTime = new Date(row.createTradeAccountTime);
        depositedCustomer.transactionType = row.transactionType;
        depositedCustomer.method = row.method;
        depositedCustomer.remark = row.remark;
        depositedCustomer.value = parseFloat(row.value);
        depositedCustomer.status = row.status;
        depositedCustomer.parentIB = row.parentIB;

        // Validate numeric and date fields
        if (isNaN(depositedCustomer.platform) || isNaN(depositedCustomer.value)) {
          throw new Error(
            `Invalid numeric data in row: ${JSON.stringify(row)}`,
          );
        }

        depositedCustomerList.push(depositedCustomer);
      }

      // Save in chunks to avoid memory issues
      const chunkSize = 1000;
      for (let i = 0; i < depositedCustomerList.length; i += chunkSize) {
        const chunk = depositedCustomerList.slice(i, i + chunkSize);
        await this.depositedCustomerRepository.save(chunk);
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      throw new Error(`Failed to process CSV file: ${error.message}`);
    }
  }

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

    // Initialize `where` to enforce `tag = '8'`
    let where: FindOptionsWhere<any> = {
      tag: '7',
      saler: In(allUserCodes),
    };

    // Apply keyword search if provided
    if (options.keyword && options.keyword.trim() !== '') {
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
    if (options.dateRange && options.dateRange.length === 2) {
      var [startDate, endDate] = options.dateRange;
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          create_at: Between(startDate, endDate),
        }));
      } else {
        where.create_at = Between(startDate, endDate);
      }
    }

    // Apply `saler` condition if provided
    if (options.saler) {
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          saler: options.saler,
        }));
      } else {
        where.saler = options.saler;
      }
    }

    // Apply `maketing` condition if provided
    if (options.maketing) {
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          maketer: options.maketing,
        }));
      } else {
        where.maketer = options.maketing;
      }
    }

    // Set order by `create_at` descending
    const orderBy = { create_at: 'DESC' };

    // Execute paginated query
    const paginatedResult = await PaginationService.paginate(
      this.customersRepository,
      options,
      where,
      [],
      {},
      orderBy,
    );

    // Fetch additional user info for the results
    const result = await usersWithManagerInfo<Customers>(
      { data: paginatedResult.data },
      this.usersRepository,
    );
    const [totalUserRegister, totalUserMaketing, totalSelf] = await Promise.all(
      [
        this.customersRepository.count({
          where: { tag: '7', create_at: Between(startDate, endDate) },
        }),
        this.customersRepository.count({
          where: {
            tag: '7',
            maketer: Not(IsNull()),
            create_at: Between(startDate, endDate),
          },
        }),
        this.customersRepository.count({
          where: {
            tag: '7',
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
    // Return the final paginated result with user info included
    return {
      ...paginatedResult,
      data: result,
      ...sectionTotalIndex
    };
  }
}
