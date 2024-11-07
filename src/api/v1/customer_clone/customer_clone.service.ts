import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerClone } from 'src/typeorm/entities/customer_clone.entity';
import { CreateCustomerCloneDto } from './dto/createCustomers.dto';
import { CommissionCrawlFrom } from 'src/typeorm/enum/commission.enum';
import { FindOperator, In, Repository } from 'typeorm';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';
import { Customers } from 'src/typeorm/entities/Customers';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
@Injectable()
export class CustomerCloneService {
  constructor(
    @InjectRepository(CustomerClone)
    private customerCloneRepository: Repository<CustomerClone>,
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
  ) {}

  async createCustomer(
    data: CreateCustomerCloneDto[],
    user_code: string,
  ): Promise<void> {
    try {
      // Nhóm khách hàng theo CrawlFrom
      const customersBySource = data.reduce(
        (acc, customer) => {
          if (!acc[customer.CrawlFrom]) {
            acc[customer.CrawlFrom] = [];
          }
          acc[customer.CrawlFrom].push(customer);
          return acc;
        },
        {} as Record<string, CreateCustomerCloneDto[]>,
      );

      // Kiểm tra trùng lặp trong mỗi CrawlFrom
      for (const [source, customers] of Object.entries(customersBySource)) {
        const emails = new Set();
        const phones = new Set();

        for (const customer of customers) {
          if (emails.has(customer.email)) {
            throw new Error(
              `Email ${customer.email} đã tồn tại trong ${source}`,
            );
          }
          if (phones.has(customer.phone)) {
            throw new Error(
              `Số điện thoại ${customer.phone} đã tồn tại trong ${source}`,
            );
          }
          emails.add(customer.email);
          phones.add(customer.phone);
        }
        const crawlFrom = source as CommissionCrawlFrom;
        // Kiểm tra xem email hoặc phone đã tồn tại trong cơ sở dữ liệu cho cùng CrawlFrom
        const existingCustomers = await this.customerCloneRepository.find({
          where: [
            {
              email: In([...emails]) as FindOperator<string>,
              CrawlFrom: crawlFrom,
            },
            {
              phone: In([...phones]) as FindOperator<string>,
              CrawlFrom: crawlFrom,
            },
          ],
        });

        if (existingCustomers.length > 0) {
          const existing = existingCustomers[0];
          throw new Error(
            `${existing.email ? 'Email' : 'Số điện thoại'} đã tồn tại trong ${source}`,
          );
        }
      }

      // Tạo và lưu khách hàng
      const customerCreates = data.map((customer) =>
        this.customerCloneRepository.create({
          ...customer,
          maketer: user_code,
        }),
      );
      await this.customerCloneRepository.insert(customerCreates);
    } catch (error) {
      throw new Error(`Lỗi tạo customers: ${error.message}`);
    }
  }

  async getAllCustomer(
    user_code: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    const orderBy = { create_at: 'DESC' };
    const result = await PaginationService.paginate(
      this.customerCloneRepository,
      { limit, page },
      {},
      [],
      {},
      orderBy,
    );
    return result;
  }

  async updateCustomer(
    customerId: number,
    data: CreateCustomerCloneDto,
  ): Promise<void> {
    const existed = await this.customerCloneRepository.findOne({
      where: { id: customerId },
    });
    if (!existed) {
      throw new Error('Không tìm thấy id khách hàng');
    }
    await this.customerCloneRepository.update(customerId, data);
  }

  async acceptCustomer(id: number): Promise<void> {
    const existed = await this.customerCloneRepository.findOne({
      where: { id: id },
    });
    if (!existed) {
      throw new Error('Không tìm thấy id khách hàng');
    }
    const { trading_id, email, phone, lot, net_dep } = existed;

    const matchCustomer = await this.customerRepository.findOne({
      where: {
        trading_id,
        email,
        phone,
      },
    });
    if (matchCustomer) {
      await this.customerRepository.update(matchCustomer.id, {
        lot,
        net_dep,
        tag: '8',
        isExamine: true,
      });
      await this.customerCloneRepository.delete(id);
      return;
    }
    throw new Error('Dữ liệu 2 bên không khớp');
  }

  async  createMultipleProductsFromCSV(
    csvBuffer: Buffer,
    accountId: number,
  ): Promise<{ success: number; skipped: number; details: string[] }> {
    try {
      const parserOptions = {
        headers: ['trading_id', 'fullname', 'email', 'phone', 'lot', 'net_dep'],
        skipLines: 0,
        trim: true
      };
  
      const stream = Readable.from(csvBuffer.toString());
      const parser = stream.pipe(csvParser(parserOptions));
      const customerList: CustomerClone[] = [];
      
      // Set để lưu trữ trading_id và phone đã tồn tại
      const existingTradingIds = new Set<string>();
      const existingPhones = new Set<string>();
  
      // Lấy dữ liệu đã tồn tại từ database
      const existingCustomers = await this.customerCloneRepository.find({
        select: ['trading_id', 'phone']
      });
  
      // Thêm dữ liệu đã tồn tại vào Set
      existingCustomers.forEach(customer => {
        if (customer.trading_id) existingTradingIds.add(customer.trading_id);
        if (customer.phone) existingPhones.add(customer.phone);
      });
  
      // Thống kê kết quả
      const stats = {
        success: 0,
        skipped: 0,
        details: [] as string[]
      };
      
      for await (const row of parser) {
        const customer = new CustomerClone();
        customer.trading_id = row.trading_id?.toString();
        customer.fullname = row.fullname?.toString();
        customer.email = row.email?.toString();
        customer.phone = row.phone?.toString();
        customer.lot = parseFloat(row.lot);
        customer.net_dep = parseFloat(row.net_dep);
  
        // Kiểm tra fullname
        if (!customer.fullname) {
          stats.skipped++;
          stats.details.push(`Bỏ qua dòng thiếu fullname: ${JSON.stringify(row)}`);
          continue;
        }
  
        // Kiểm tra dữ liệu số
        if (isNaN(customer.lot) || isNaN(customer.net_dep)) {
          stats.skipped++;
          stats.details.push(`Bỏ qua dòng có dữ liệu số không hợp lệ: ${JSON.stringify(row)}`);
          continue;
        }
  
        // Kiểm tra và bỏ qua trường hợp trùng trading_id
        if (customer.trading_id && existingTradingIds.has(customer.trading_id)) {
          stats.skipped++;
          stats.details.push(`Bỏ qua do trùng Trading ID: ${customer.trading_id}`);
          continue;
        }
  
        // Kiểm tra và bỏ qua trường hợp trùng phone
        if (customer.phone && existingPhones.has(customer.phone)) {
          stats.skipped++;
          stats.details.push(`Bỏ qua do trùng số điện thoại: ${customer.phone}`);
          continue;
        }
  
        // Thêm vào danh sách các ID đã xử lý
        if (customer.trading_id) existingTradingIds.add(customer.trading_id);
        if (customer.phone) existingPhones.add(customer.phone);
  
        customerList.push(customer);
        stats.success++;
      }
  
      // Lưu dữ liệu theo chunks
      const chunkSize = 1000;
      for (let i = 0; i < customerList.length; i += chunkSize) {
        const chunk = customerList.slice(i, i + chunkSize);
        await this.customerCloneRepository.save(chunk);
      }
  
      console.log(`Hoàn thành xử lý CSV:
        - Số bản ghi thành công: ${stats.success}
        - Số bản ghi bị bỏ qua: ${stats.skipped}`);
  
      return stats;
  
    } catch (error) {
      console.error('Lỗi xử lý CSV:', error);
      throw new Error(`Không thể xử lý file CSV: ${error.message}`);
    }
  }
}
