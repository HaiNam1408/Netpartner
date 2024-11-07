import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { writeReport } from 'src/typeorm/entities/write_report';
import { In, Repository } from 'typeorm';
import { CreateWriteReportDto } from './dto/createWriteReport.dto';
import { GlobalRecusive } from 'src/global/globalRecusive';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';

@Injectable()
export class WriteReportService {
  constructor(
    @InjectRepository(writeReport)
    private writeReportRepository: Repository<writeReport>,
    private globalRecusive: GlobalRecusive,
  ) {}

  async createWriteReport(
    data: CreateWriteReportDto,
    userId: number,
  ): Promise<void> {
    await this.writeReportRepository.save({ ...data, userId: userId });
  }

  async getAllReport(
    user_code: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResult<any>> {
    const subordinateUserCodes =
      await this.globalRecusive.getAllSubordinateUserCodes(user_code);

    const order = {
      create_at: 'DESC',
    };
    const newSubor = [...subordinateUserCodes, user_code];
    const where = {
      user: {
        user_code: In(newSubor),
      },
    };
    const relations = ['user'];
    const select = {
      user: {
        id: true,
        user_code: true,
        email: true,
        duty: true,
        fullname: true,
        phone: true,
        accountBank: true,
        CV: true,
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
      },
    };
    return await PaginationService.paginate(
      this.writeReportRepository,
      { page, limit },
      where,
      relations,
      select,
      order,
    );
  }

  async getReportId(id: number): Promise<writeReport> {
    return await this.writeReportRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
      select: {
        user: {
          id: true,
          user_code: true,
          email: true,
          duty: true,
          fullname: true,
          phone: true,
          accountBank: true,
          CV: true,
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
        },
      },
    });
  }

  async getReportUser(userId:number):Promise<writeReport[]>{
    return await this.writeReportRepository.find({
      relations: ['user'],
      where: {
        userId,
      },
      select: {
        user: {
          id: true,
          user_code: true,
          email: true,
          duty: true,
          fullname: true,
          phone: true,
          accountBank: true,
          CV: true,
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
        },
      },
    });
  }
}
