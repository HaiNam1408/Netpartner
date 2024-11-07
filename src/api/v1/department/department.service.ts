import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/typeorm/entities/department';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/createDepartment.dto';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private DepartmentRepository: Repository<Department>,
      ){}
      async createDepartment(data: CreateDepartmentDto):Promise<Department> {
        return this.DepartmentRepository.save(data)
      }
    
      async findAllDepartment():Promise<Department[]> {
        return this.DepartmentRepository.find();
      }
    
      async removeDepartment(id: number) {
        return this.DepartmentRepository.delete(id);
      }
}
