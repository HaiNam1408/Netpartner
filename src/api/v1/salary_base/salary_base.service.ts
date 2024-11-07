import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalaryBase } from 'src/typeorm/entities/salary_base';
import { Repository } from 'typeorm';
import { CreateSalaryDto } from './dto/createSalaryDto';
import { CreateSalaryBase } from '../salary/dto/createSalaryBase.dto';

@Injectable()
export class SalaryBaseService {
    constructor(
        @InjectRepository(SalaryBase)
        private salaryBaseRepository:Repository<SalaryBase>
    ){}

    async createSalary(data: CreateSalaryBase): Promise<void> {
        // Kiểm tra xem đã tồn tại bản ghi với department_code này chưa
        const existingSalary = await this.salaryBaseRepository.findOne({
          where: { department_code: data.department_code },
        });
        if (existingSalary) {
          const salary = Object.assign(existingSalary,data)
          // Nếu đã tồn tại, cập nhật bản ghi
          await this.salaryBaseRepository.save(
            salary
          );
        } else {
          // Nếu chưa tồn tại, tạo mới bản ghi
          const newSalary = this.salaryBaseRepository.create(data);
          await this.salaryBaseRepository.save(newSalary);
        }
      }
    
}
