import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from 'src/typeorm/entities/Customers';
import {
  Between,
  FindOperator,
  FindOptionsWhere,
  getRepository,
  In,
  IsNull,
  Like,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { Users } from 'src/typeorm/entities/users';
import {
  PaginatedResult,
  PaginationOptions,
  PaginationService,
} from 'src/global/globalPagination';
import { GlobalRecusive } from 'src/global/globalRecusive';
import * as moment from 'moment';
import { Role } from 'src/typeorm/enum/role.enum';
import { CommissionCrawlFrom } from 'src/typeorm/enum/commission.enum';
import { MailerService } from 'src/mailer/mailer.service';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { RegisteredCustomer } from 'src/typeorm/entities/register_customer';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { usersWithManagerInfo } from 'src/api/utils/getInfo.utils';
import { CreateCustomerDto } from './dto/createCustomers.dto';
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Affiliate)
    private readonly afiliateRepository: Repository<Affiliate>,
    @InjectRepository(RegisteredCustomer)
    private readonly registerCustomerRepository: Repository<RegisteredCustomer>,
    private globalRecusive: GlobalRecusive,
    private readonly mailerService: MailerService,
  ) {}

  async createCustomer(
    data: CreateCustomerDto[],
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
        {} as Record<string, CreateCustomerDto[]>,
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
        const existingCustomers = await this.customerRepository.find({
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
        this.customerRepository.create({ ...customer, maketer: user_code }),
      );
      await this.customerRepository.insert(customerCreates);
    } catch (error) {
      throw new Error(`Lỗi tạo customers: ${error.message}`);
    }
  }
  async updateCustomer(
    customerId: number,
    data: CreateCustomerDto,
  ): Promise<void> {
    const existed = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!existed) {
      throw new Error('Không tìm thấy id khách hàng');
    }
    await this.customerRepository.update(customerId, data);
  }

  async GetAllCustomer(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
      user_code?: string;
      source?: string;
      saler?: string;
    },
  ): Promise<PaginatedResult<any>> {
    try {
      // Define default selection fields
      const select = {
        id: true,
        user_code: true,
        email: true,
        accountBank: true,
        CV: true,
        duty: true,
        fullname: true,
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
      };

      // Initialize `where` condition with default value for `saler`
      let where: FindOptionsWhere<any> = {
        isExamine: false,
        saler: IsNull(),
      };

      // Apply user code, source, and saler filters if provided
      if (options.user_code) where.maketer = options.user_code;
      if (options.source) where.source = options.source;
      if (options.saler) where.saler = options.saler;

      // Apply date range condition if specified
      if (options.dateRange?.length === 2) {
        const [startDate, endDate] = options.dateRange;
        where.create_at = Between(startDate, endDate);
      }

      // Apply keyword search across multiple fields if a keyword is provided
      if (options.keyword?.trim()) {
        const searchText = options.keyword.trim();
        where = [
          { ...where, phone: Like(`%${searchText}%`) },
          { ...where, email: Like(`%${searchText}%`) },
          { ...where, fullname: Like(`%${searchText}%`) },
        ];

        // Include date range condition with keyword search if applicable
        if (options.dateRange?.length === 2) {
          where = where.map((condition) => ({
            ...condition,
            create_at: Between(options.dateRange[0], options.dateRange[1]),
          }));
        }
      }

      // Set default ordering by `create_at` in descending order
      const orderBy = { create_at: 'DESC' };

      // Execute paginated query
      const result = await PaginationService.paginate(
        this.customerRepository,
        options,
        where,
        [],
        {},
        orderBy,
      );
      // Fetch additional manager info for related user codes (maketer and leader)
      const usersWithManagerInfo = await Promise.all(
        result.data.map(async (user) => {
          const userCodesToFetch = [user.maketer, user.leader].filter(Boolean);
          if (userCodesToFetch.length === 0) return user;

          const relatedUsers = await this.usersRepository.find({
            select,
            where: {
              user_code: In(userCodesToFetch),
              delete_at: false,
            },
          });

          const maketerInfo = relatedUsers.find(
            (u) => u.user_code === user.maketer,
          );
          const leaderInfo = relatedUsers.find(
            (u) => u.user_code === user.leader,
          );

          return {
            ...user,
            ...(maketerInfo && { maketerInfo }),
            ...(leaderInfo && { leaderInfo }),
          };
        }),
      );

      // Return the paginated result with the enhanced data
      return {
        ...result,
        data: usersWithManagerInfo,
      };
    } catch (error) {
      throw new Error('Error retrieving all customers');
    }
  }

  async GetUserFollowSaler(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
      tag?: string;
      saler?: string;
      maketing?: string;
    },
    user_code?: string,
  ): Promise<PaginatedResult<any>> {
    const select = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
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
    };

    // Retrieve user codes, including the user's code and any subordinate codes
    const subordinateUserCodes =
      await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    const allUserCodes = user_code
      ? [user_code, ...subordinateUserCodes]
      : subordinateUserCodes;

    // Initialize `where` to enforce `tag = '8'`
    let where: FindOptionsWhere<any> = {
      tag: In(['6', '1', '2', '3', '4', '5', '8']),
      isExamine: false,
      saler: In(allUserCodes),
    };
    if (options.tag) {
      where.tag = options.tag;
    }
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
      this.customerRepository,
      options,
      where,
      [],
      {},
      orderBy,
    );
    const usersWithManagerInfo = await Promise.all(
      paginatedResult.data.map(async (user) => {
        const userCodesToFetch = [user.maketer, user.leader, user.saler].filter(
          Boolean,
        );
        if (userCodesToFetch.length === 0) return user;

        const relatedUsers = await this.usersRepository.find({
          select,
          where: {
            user_code: In(userCodesToFetch),
            delete_at: false,
          },
        });

        const maketerInfo = relatedUsers.find(
          (u) => u.user_code === user.maketer,
        );
        const leaderInfo = relatedUsers.find(
          (u) => u.user_code === user.leader,
        );
        const salerInfo = relatedUsers.find((u) => u.user_code === user.saler);

        return {
          ...user,
          ...(maketerInfo && { maketerInfo }),
          ...(leaderInfo && { leaderInfo }),
          ...(salerInfo && { salerInfo }),
        };
      }),
    );
    const [totalUserRegister, totalUserMaketing, totalSelf, totalUserAccess] =
      await Promise.all([
        this.customerRepository.count({
          where: {
            tag: In(['6', '1', '2', '3', '4', '5', '8']),
            isExamine: false,
            create_at: Between(startDate, endDate),
          },
        }),
        this.customerRepository.count({
          where: {
            tag: In(['6', '1', '2', '3', '4', '5', '8']),
            isExamine: false,
            maketer: Not(IsNull()),
            create_at: Between(startDate, endDate),
          },
        }),
        this.customerRepository.count({
          where: {
            tag: In(['6', '1', '2', '3', '4', '5', '8']),
            isExamine: false,
            saler: user_code,
            create_at: Between(startDate, endDate),
          },
        }),
        this.customerRepository.count({
          where: {
            tag: In(['6', '1', '2', '3', '4', '5', '8']),
            isExamine: false,
            create_at: Between(startDate, endDate),
          },
        }),
      ]);

    // Construct additional index info
    const sectionTotalIndex = {
      totalUserRegister,
      totalUserMaketing,
      totalSelf,
      totalUserAccess,
    };

    // Return the final paginated result with user info included
    return {
      ...paginatedResult,
      data: usersWithManagerInfo,
      ...sectionTotalIndex,
    };
  }

  async GetCustomerByUser(
    user_code: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<Customers>> {
    const select = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
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
    };

    let where: FindOptionsWhere<any>[] = [
      { maketer: user_code },
      { saler: user_code },
    ];

    const orderBy = { update_at: 'DESC' };

    const paginationResult = await PaginationService.paginate(
      this.customerRepository,
      { page, limit },
      where,
      [],
      {},
      orderBy,
    );

    const usersWithManagerInfo = await Promise.all(
      paginationResult.data.map(async (user) => {
        const userCodesToFetch = [user.maketer, user.leader, user.saler].filter(
          Boolean,
        );
        if (userCodesToFetch.length === 0) return user;

        const relatedUsers = await this.usersRepository.find({
          select,
          where: {
            user_code: In(userCodesToFetch),
            delete_at: false,
          },
        });

        const maketerInfo = relatedUsers.find(
          (u) => u.user_code === user.maketer,
        );
        const leaderInfo = relatedUsers.find(
          (u) => u.user_code === user.leader,
        );
        const salerInfo = relatedUsers.find((u) => u.user_code === user.saler);

        return {
          ...user,
          ...(maketerInfo && { maketerInfo }),
          ...(leaderInfo && { leaderInfo }),
          ...(salerInfo && { salerInfo }),
        };
      }),
    );

    return {
      ...paginationResult,
      data: usersWithManagerInfo,
    };
  }

  async CustomerFillToForm(data: CreateCustomerDto): Promise<void> {
    const check = await this.customerRepository.findOne({
      where: [
        {
          email: data.email,
          CrawlFrom: data.CrawlFrom,
        },
        {
          phone: data.phone,
          CrawlFrom: data.CrawlFrom,
        },
      ],
    });
    if (check) throw new Error('Số điện thoại hoặc email đã tồn tại');
    const result = await this.customerRepository.save(data);
    if (result) {
      const user = await this.usersRepository.findOne({
        where: { user_code: result?.maketer || result?.saler },
      });
      const affiliate = await this.afiliateRepository.findOne({
        where: { userId: user.id },
      });
      if (!affiliate) {
        throw new Error(
          'Affiliate không tồn tại hoặc không tìm thấy affiliate tương ứng',
        );
      }

      await this.afiliateRepository.increment(
        { id: affiliate.id },
        'total_usage',
        1,
      );

      await this.mailerService.sendMail(
        data.email,
        'Thư thông báo',
        '',
        this.mailerService.affiliateNew(result.fullname, affiliate.link),
      );
    }
  }

  async UpdateInfoCustomer(
    option: CreateCustomerDto[],
    user_code: string,
    role: string,
  ): Promise<void> {
    // Kiểm tra số lượng khách hàng được chọn
    const number = option.length;
    if (role == Role.SALE && number > 5) {
      throw new Error('Bạn không thể lựa chọn hơn 5 khách 1 lúc');
    }

    // Tìm thông tin người dùng
    const user = await this.usersRepository.findOne({
      where: {
        user_code: user_code,
      },
    });

    // Tính toán các thông tin thời gian
    const now = moment();
    const createAt = moment(user.create_at, 'YYYY-MM-DD HH:mm:ss');
    const differenceInDays = now.diff(createAt, 'days');
    const currentMonth = moment().startOf('month');
    const currentMonthEnd = moment().endOf('month');

    // Tìm record có flag_time gần nhất
    const flaggedRecord = await this.customerRepository.findOne({
      where: {
        saler: user.user_code,
        flag_time: Not(IsNull()),
      },
      order: {
        flag_time: 'DESC',
      },
    });

    let currentFlagTime = now.toDate();
    let availableSlots = 5;

    if (flaggedRecord) {
      const timeSinceFlag = now.diff(
        moment(flaggedRecord.flag_time),
        'hours',
        true,
      );

      if (timeSinceFlag < 2) {
        // Nếu chưa qua 2 giờ, sử dụng flag_time hiện tại
        currentFlagTime = flaggedRecord.flag_time;
        // Đếm số lượng khách hàng từ flag_time đến thời điểm hiện tại
        const recentCount = await this.customerRepository.count({
          where: {
            saler: user_code,
            update_at: Between(currentFlagTime, now.toDate()),
          },
        });
        availableSlots = 5 - recentCount;
      }
      // Nếu đã qua 2 giờ, resetFlag_time và availableSlots vẫn là 5
    }

    if (number > availableSlots) {
      const nextAvailableTime = moment(currentFlagTime).add(2, 'hours');
      throw new Error(
        `Bạn chỉ có thể lấy thêm ${availableSlots} khách trong khoảng thời gian này. Bạn có thể lấy thêm khách từ ${nextAvailableTime.format('HH:mm')}.`,
      );
    }

    // Set flag_time cho record đầu tiên trong option nếu bắt đầu chu kỳ mới
    if (
      option.length > 0 &&
      (!flaggedRecord ||
        now.diff(moment(flaggedRecord.flag_time), 'hours', true) >= 2)
    ) {
      option[0].flag_time = currentFlagTime;
    }

    // Tạo các đối tượng khách hàng mới
    const updateUser = option.map((customer) =>
      this.customerRepository.create({
        ...customer,
        saler: user_code,
        update_at: new Date(),
      }),
    );

    // Xác định giới hạn khách hàng dựa trên thời gian làm việc
    const customerLimit = differenceInDays <= 30 ? 50 : 100;

    // Đếm số lượng khách hàng trong tháng hiện tại
    const [_, quantity] = await this.customerRepository.findAndCount({
      where: {
        saler: user.user_code,
        update_at: Between(currentMonth.toDate(), currentMonthEnd.toDate()),
      } as FindOptionsWhere<Customers>,
    });

    // Kiểm tra giới hạn khách hàng
    if (quantity + number > customerLimit) {
      const remainingSlots = customerLimit - quantity;
      throw new Error(
        `Số khách bạn đã lấy ${quantity}, bạn chỉ có thể lấy thêm ${remainingSlots} khách trong tháng này`,
      );
    }

    // Lưu các khách hàng mới vào database
    await this.customerRepository.save(updateUser);
  }

  async passCustomer(
    options: { id: number; saler: string }[],
    user_code: string,
    role: string,
  ): Promise<void> {
    // Tìm người dùng đang chuyển khách hàng
    const user = await this.usersRepository.findOne({
      where: { user_code },
    });

    // Kiểm tra xem người dùng có tồn tại và không phải là leader
    if (!user && role !== Role.LEADER) {
      throw new Error(
        'User_code không tồn tại hoặc không có quyền chuyển khách hàng',
      );
    }

    // Tìm leader để gán khách hàng
    const leader = await this.usersRepository.findOne({
      where: { role: Role.LEADER },
    });

    if (!leader) {
      throw new Error('Không tìm thấy leader để chuyển khách hàng');
    }

    // Xử lý từng khách hàng trong mảng options
    for (const option of options) {
      // Cập nhật bản ghi khách hàng
      const updateResult = await this.customerRepository.update(
        { id: option.id },
        {
          saler: option.saler,
          leader: leader.user_code,
        },
      );

      if (updateResult.affected === 0) {
        throw new Error(
          `Không tìm thấy hoặc không thể cập nhật khách hàng với id ${option.id}`,
        );
      }
    }
  }

  async DeleteCustomer(id: number): Promise<void> {
    const check = await this.customerRepository.findOneBy({ id });
    if (!check) throw new Error('Id không tìm thấy');
    await this.customerRepository.delete(id);
  }

  async GetUserFollowMaketer(
    options: PaginationOptions & {
      keyword?: string;
      dateRange?: [Date, Date];
      tag?: string;
      source?: string | CommissionCrawlFrom;
      saler?: string;
    },
    user_code?: string,
  ): Promise<PaginatedResult<any>> {
    const select = {
      id: true,
      user_code: true,
      email: true,
      accountBank: true,
      CV: true,
      duty: true,
      fullname: true,
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
    };

    const subordinateUserCodes =
      await this.globalRecusive.getAllSubordinateUserCodes(user_code);
    const allUserCodes = user_code
      ? [user_code, ...subordinateUserCodes]
      : subordinateUserCodes;

    let baseWhere: FindOptionsWhere<any> = {
      maketer: In(allUserCodes),
      isExamine: false,
      saler: Not(IsNull()),
    };

    if (options.dateRange?.length === 2) {
      var [startDate, endDate] = options.dateRange;
      baseWhere.create_at = Between(startDate, endDate);
    }
    if (options.saler) {
      baseWhere.saler = options.saler;
    }
    if (options.source) {
      if (
        Object.values(CommissionCrawlFrom).includes(
          options.source as CommissionCrawlFrom,
        )
      ) {
        baseWhere.CrawlFrom = options.source as CommissionCrawlFrom;
      } else if (typeof options.source === 'string') {
        baseWhere.maketer = options.source;
      } else {
        console.warn(`Invalid source provided: ${options.source}`);
        // Or throw an error, or handle it in another way
      }
    }
    let where: FindOptionsWhere<any> | FindOptionsWhere<any>[] = baseWhere;

    if (options.keyword?.trim() || options.tag) {
      const searchConditions: FindOptionsWhere<any>[] = [];

      if (options.keyword?.trim()) {
        const searchText = options.keyword.trim();
        ['phone', 'email', 'fullname'].forEach((field) => {
          searchConditions.push({
            ...baseWhere,
            [field]: Like(`%${searchText}%`),
          });
        });
      }

      if (options.tag) {
        searchConditions.push({
          ...baseWhere,
          tag: Like(`%${options.tag}%`),
        });
      }

      where = searchConditions;
    }

    const orderBy = { update_at: 'DESC' };

    const paginationResult = await PaginationService.paginate(
      this.customerRepository,
      options,
      where,
      [],
      {},
      orderBy,
    );

    const usersWithManagerInfo = await Promise.all(
      paginationResult.data.map(async (user) => {
        const userCodesToFetch = [user.maketer, user.leader, user.saler].filter(
          Boolean,
        );
        if (userCodesToFetch.length === 0) return user;

        const relatedUsers = await this.usersRepository.find({
          select,
          where: {
            user_code: In(userCodesToFetch),
            delete_at: false,
          },
        });

        const maketerInfo = relatedUsers.find(
          (u) => u.user_code === user.maketer,
        );
        const leaderInfo = relatedUsers.find(
          (u) => u.user_code === user.leader,
        );
        const salerInfo = relatedUsers.find((u) => u.user_code === user.saler);

        return {
          ...user,
          ...(maketerInfo && { maketerInfo }),
          ...(leaderInfo && { leaderInfo }),
          ...(salerInfo && { salerInfo }),
        };
      }),
    );
    const [
      totalCustomer,
      totalCustomerAccess,
      totalUserRegister,
      totalUserRecharge,
    ] = await Promise.all([
      this.customerRepository.count({
        where: {
          maketer: In(allUserCodes),
          create_at: Between(startDate, endDate),
        },
      }),
      this.customerRepository.count({
        where: {
          tag: In(['2', '3', '6']),
          isExamine: false,
          maketer: In(allUserCodes),
          create_at: Between(startDate, endDate),
        },
      }),
      this.customerRepository.count({
        where: {
          tag: '8',
          isExamine: false,
          maketer: In(allUserCodes),
          create_at: Between(startDate, endDate),
        },
      }),
      this.customerRepository.count({
        where: {
          tag: '7',
          isExamine: false,
          maketer: In(allUserCodes),
          create_at: Between(startDate, endDate),
        },
      }),
    ]);

    // Construct additional index info
    const sectionTotalIndex = {
      totalCustomer,
      totalCustomerAccess,
      totalUserRegister,
      totalUserRecharge,
    };
    return {
      ...paginationResult,
      data: usersWithManagerInfo,
      ...sectionTotalIndex,
    };
  }
  //chỉ số kho khách hàng
  async getCustomerStatistics(user: any) {
    const customerRepository = this.customerRepository;

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const [totalCustomers, newCustomers, takenCustomers, notTakenCustomers] =
      await Promise.all([
        customerRepository.count(),
        customerRepository.count({
          where: {
            create_at: MoreThanOrEqual(twoDaysAgo),
          },
        }),
        customerRepository.count({
          where: {
            saler: user.role === 'CEO' ? Not(IsNull()) : user.user_code,
          },
        }),
        customerRepository.count({
          where: {
            saler: IsNull(),
          },
        }),
      ]);

    return {
      totalCustomers,
      notTakenCustomers,
      newCustomers,
      takenCustomers,
    };
  }
  //tổng khách hàng
  async calculateCustomerStatistics() {
    // Get total customers count
    const totalCustomers = await this.customerRepository.count();

    // Get approached customers with tags '1' and '2'
    const approachedCustomers = await this.customerRepository.count({
      where: [{ tag: '1' }, { tag: '2' }],
    });
    const approachedRate = (approachedCustomers / totalCustomers) * 100;

    // Get total affiliate usage
    const totalAffiliateUsage = await this.afiliateRepository
      .createQueryBuilder('affiliate')
      .select('SUM(affiliate.total_usage)', 'total')
      .getRawOne();
    const totalUsage = (await totalAffiliateUsage)
      ? totalAffiliateUsage.total
      : 0;
    // Get registered customers count and calculate conversion rate
    const registeredCustomers = await this.registerCustomerRepository.count();
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
    const investmentRate = (newCustomersWithDeposit / totalCustomers) * 100;

    return {
      totalCustomers,
      approachedRate,
      conversionRate,
      investmentRate,
    };
  }

  async getListSrouce(): Promise<any> {
    const result = await this.usersRepository.find({
      where: {
        role: Role.MAKETER,
        status: StatusUser.ACTIVE,
        delete_at: false,
      },
      select: { id: true, fullname: true, user_code: true },
    });
    return {
      dooprime: CommissionCrawlFrom.DOOPRIME,
      atoes: CommissionCrawlFrom.AETOS,
      users: [...result],
    };
  }

  async getListSrouceSaler(): Promise<any> {
    const result = await this.usersRepository.find({
      where: {
        role: Role.SALE,
        status: StatusUser.ACTIVE,
        delete_at: false,
      },
      select: { id: true, fullname: true, user_code: true },
    });
    return {
      dooprime: CommissionCrawlFrom.DOOPRIME,
      atoes: CommissionCrawlFrom.AETOS,
      users: [...result],
    };
  }

  async revokeCustomer(id: number): Promise<any> {
    try {
      await this.customerRepository.update(id, {
        saler: null,
        update_at: new Date(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
