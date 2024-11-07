import { Repository } from 'typeorm';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationService {
  static async paginate<T>(
    repository: Repository<T>,
    options: PaginationOptions,
    whereConditions: any = {},
    relations: string[] = [],
    select:any={},
    orderBy: any = {}
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [data, total] = await repository.findAndCount({
      where: whereConditions,
      relations: relations,
      select:select,
      order: orderBy,
      take: limit,
      skip: skip,
    });
    
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}