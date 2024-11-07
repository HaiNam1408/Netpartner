import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/typeorm/entities/categories';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private CategoryRepository: Repository<Category>,
      ){}
      async createCategory(data: CreateCategoryDto):Promise<Category> {
        return this.CategoryRepository.save(data)
      }
    
      async findAllCategory(title:string):Promise<Category[]> {
        return this.CategoryRepository.find({
            where:{
                title:Like(`%${title}%`)
            }
        });
      }
    
      async removeCategory(id: number) {
        return this.CategoryRepository.delete(id);
      }
}
