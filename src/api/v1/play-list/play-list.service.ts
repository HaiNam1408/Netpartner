import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayList } from 'src/typeorm/entities/playList';
import { Repository } from 'typeorm';
import { CreatePlayListDto } from './dto/createPlayList.dto';
import { UpdatePlayListDto } from './dto/upadtePlayList.dto';
import { TypeEducation } from 'src/typeorm/enum/typeEdu';

@Injectable()
export class PlayListService {
  constructor(
    @InjectRepository(PlayList)
    private playListRepository: Repository<PlayList>,
  ) {}

  async createPlayList(data: CreatePlayListDto) {
    return this.playListRepository.save(data);
  }

  async updatePlayList(data: UpdatePlayListDto, id: number) {
    return this.playListRepository.update(id, {
      ...data,
      update_at: new Date(),
    });
  }

  async getAllPlayList(type: TypeEducation) {
    return this.playListRepository.find({ where: { type } });
  }

  async getPlayListId(id: number) {
    return this.playListRepository.findOneBy({ id });
  }

  async deletePlayList(id: number) {
    return this.playListRepository.delete(id);
  }
}
