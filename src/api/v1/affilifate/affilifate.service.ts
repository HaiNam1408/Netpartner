import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { Repository } from 'typeorm';
import { CreateAffiliateDto } from './dto/createAffiliate.dto';
import { UpdateAffiliateDto } from './dto/updateaffiliate.dto';
import { Role } from 'src/typeorm/enum/role.enum';

@Injectable()
export class AffilifateService {
    constructor(
        @InjectRepository(Affiliate)
        private readonly affiliateRepository : Repository<Affiliate>
    ){}

    async createAffiliate(data: CreateAffiliateDto,userId:number):Promise<Affiliate> {
        return this.affiliateRepository.save({...data,userId})
      }
    
    async findAllAffiliateLink(id:number):Promise<Affiliate[]> {
        return this.affiliateRepository.find({
           where:{
            userId:id
           }
        });
    }

    async findAffiliateLinkId(id:number):Promise<Affiliate> {
        return this.affiliateRepository.findOneBy({id});
    }

    async updateAffiliate(data:UpdateAffiliateDto,id:number):Promise<any>{
        await this.affiliateRepository.update(id,data)
    }
    
    async removeAffiliate(id: number,role:string, userId:number):Promise<void> {
        const check =  await this.affiliateRepository.findOne({
            where:{
                userId:userId
            }
        })
        if(role === Role.CEO || check){
            await this.affiliateRepository.delete(id);
        }else{
            throw new Error('Bạn không có quyền xóa link tiếp thị này');
        }
            
            
        
    }
}
