import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteFile, saveFile } from 'src/global/globalFile';
import { Settings } from 'src/typeorm/entities/settings';
import { Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/setting.dto';
import { coreValue } from 'src/typeorm/enum/coreValue.enum';

@Injectable()
export class CoreValueService {
    constructor(
        @InjectRepository(Settings)
        private settingRepository:Repository<Settings>
    ){}

    async updateSetting(
        id:number,
        data:UpdateSettingDto,
        attachment:Express.Multer.File | undefined,
    ):Promise<void>{
        const settingToUpdate = await this.settingRepository.findOneBy({id});
        const settingFolder = './uploads/settings';
        let fileAttachment
        if(attachment){
            fileAttachment = await saveFile(attachment,settingFolder);
            await deleteFile(`./${settingToUpdate.attachment}`)
          }
          Object.assign(settingToUpdate, {...data,attachment:fileAttachment});
          await this.settingRepository.save(settingToUpdate);
    }

    async getAll():Promise<Settings[]>{
        return await this.settingRepository.find({
            where:{
                type:coreValue.CORE_VALUE
            }
        });
    }

    async getSettingId(id:number):Promise<Settings>{
        return await this.settingRepository.findOneBy({id});
    }
}
