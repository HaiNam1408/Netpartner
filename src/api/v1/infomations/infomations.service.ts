import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Infomation } from 'src/typeorm/entities/infomation';
import { Repository } from 'typeorm';
import { UpdateInfomationDto } from './dto/updateInfomation.dto';
import { deleteFile, saveFile } from 'src/global/globalFile';
import { CreateInfomationDto } from './dto/createInfomation.dto';
import { PaginatedResult, PaginationService } from 'src/global/globalPagination';

@Injectable()
export class InfomationsService {
    constructor(
        @InjectRepository(Infomation)
        private readonly infomationRepository : Repository<Infomation>
    ){}

    async createInfomation(
        data: CreateInfomationDto,
        user_id:number, 
        attachment:Express.Multer.File | undefined,
        cover:Express.Multer.File | undefined,
        InfomationFolder:string
      )  
        :Promise<Infomation> 
      {
        let fileAttachment, coverImg;
        if(attachment)
          fileAttachment = await saveFile(attachment,InfomationFolder);
        if(cover)
          coverImg = await saveFile(cover,InfomationFolder);
        return this.infomationRepository.save({...data,authorId:user_id, attachment:fileAttachment, cover:coverImg})
      }
    
      async findAllInfomation(
        page:number,
        limit:number
      ): Promise<PaginatedResult<Infomation>> {
        const where: Partial<any> = {};
        
        const select = {
          id: true,
          title: true,
          content: true,
          attachment: true,
          cover:true,
          create_at: true,
          views: true,
          user: {
            id: true,
            user_code: true,
            email: true,
            fullname: true,
            phone: true,
            accountBank: true,
            CV: true,
            duty:true,
            role: true,
            manager: true,
            gender: true,
            date_of_birth: true,
            attendance_code: true,
            cccd_front: true,
            cccd_back: true,
            avatar: true,
            delete_at:false,
            status:true
          }
        };
      
        const orderBy = { create_at: 'DESC' };
      
        return PaginationService.paginate<Infomation>(
          this.infomationRepository,
          { page, limit },
          where,
          ['user'],
          select,
          orderBy
        );
      }

      async findInfomationId(id : number){
        const check = await this.infomationRepository.findOneBy({id});
        if(!check)
          throw new Error('Id not found')
        check.views++;
        await this.infomationRepository.update(id,check);
        return check;
      }

      async updateInfomation(
        data:UpdateInfomationDto,
        id:number,
        attachment:Express.Multer.File | undefined,
        cover:Express.Multer.File | undefined){
        const InfomationToUpdate = await this.infomationRepository.findOneBy({id});
        const infomationFolder = './uploads/infomation';
        let fileAttachment,coverImg;
        if(attachment){
          fileAttachment = await saveFile(attachment,infomationFolder);
          await deleteFile(`./${InfomationToUpdate.attachment}`)
        }
        if(cover){
          coverImg = await saveFile(cover,infomationFolder);
          await deleteFile(`./${InfomationToUpdate.cover}`)
        }
        Object.assign(InfomationToUpdate, {...data,attachment:fileAttachment, cover:coverImg});
        return this.infomationRepository.save(InfomationToUpdate);
      }
    
      async removeInfomation(id: number) {
        const check = await this.infomationRepository.findOneBy({id})
        if(check.attachment){
          await deleteFile(`./${check.attachment}`)
        }
        if(check.cover){
          await deleteFile(`./${check.cover}`)
        }
        return this.infomationRepository.delete(id);
      }
}
