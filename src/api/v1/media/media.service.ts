import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/typeorm/entities/media';
import { Between, In, Like, Not, Repository } from 'typeorm';
import { CreateMediaDto } from './dto/createMedia.dto';
import { deleteFile, saveFile } from 'src/global/globalFile';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';
import { TypeMedia } from 'src/typeorm/enum/typeMedia';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}
  async createMedia(data: CreateMediaDto, user_id: number): Promise<Media> {
    try {
      return this.mediaRepository.save({ ...data, authorId: user_id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllMedia(
    title?: string,
    type?: string,
    date?: [Date, Date],
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Media>> {
    const where: Partial<any> = {};
    let startDate, endDate;
    if (date && date.length === 2) {
      [startDate, endDate] = date;
    }
    if (date) where.create_at = Between(startDate, endDate);

    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (type) {
      where.type = Like(`%${type}%`);
    } else {
      where.type = Not(
        In([
          TypeMedia.CONG_THONG_TIN,
          TypeMedia.QUY_DINH_VA_PHAP_CHE,
          TypeMedia.QUY_TRINH_LAM_VIEC,
        ]),
      );
    }

    const select = {
      id: true,
      title: true,
      content: true,
      link: true,
      create_at: true,
      views: true,
      type: true,
      isPinned: true,
      pinnedPosition: true,
      user: {
        id: true,
        user_code: true,
        email: true,
        fullname: true,
        accountBank: true,
        CV: true,
        duty: true,
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
      },
      department: true,
    };

    const orderBy = { isPinned: 'DESC', pinnedPosition: 'ASC', create_at: 'DESC' };

    return PaginationService.paginate<Media>(
      this.mediaRepository,
      { page, limit },
      where,
      ['user', 'department'],
      select,
      orderBy,
    );
  }

  async findMediaId(id: number) {
    const select: any = {
      id: true,
      title: true,
      content: true,
      link: true,
      create_at: true,
      type: true,
      views: true,
      user: {
        id: true,
        user_code: true,
        email: true,
        fullname: true,
        accountBank: true,
        CV: true,
        duty: true,
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
      },
      department: true,
    };
    const check = await this.mediaRepository.findOne({
      relations: ['user', 'department'],
      select,
      where: {
        id,
      },
    });
    if (!check) throw new Error('Không tìm thấy id bài viết này');
    check.views++;
    await this.mediaRepository.update(id, check);

    return check;
  }

  async updateMedia(data: CreateMediaDto, id: number) {
    const MediaToUpdate = await this.mediaRepository.findOneBy({ id });
    if (data.link) {
      Object.assign(MediaToUpdate, { ...data });
      return this.mediaRepository.save(MediaToUpdate);
    }

    Object.assign(MediaToUpdate, { ...data, link: data.link });
    return this.mediaRepository.save(MediaToUpdate);
  }

  async removeMedia(id: number) {
    const check = await this.mediaRepository.findOneBy({ id });
    return this.mediaRepository.delete(id);
  }

  async pinMedia(id: number, isPinned: boolean): Promise<Media> {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) throw new Error('Không tìm thấy bài viết này.');

    // Kiểm tra số lượng bài ghim của type này
    const pinnedMedias = await this.mediaRepository.find({
      where: { type: media.type, isPinned: true },
      order: { pinnedPosition: 'ASC' },
    });

    if (isPinned) {
        if (pinnedMedias.length >= 5) {
            throw new Error(`Đã đạt giới hạn ghim 5 bài cho ${media.type}.`);
        }

        // Lấy danh sách các vị trí đã được sử dụng
        const usedPositions = new Set(pinnedMedias.map(m => m.pinnedPosition));

        // Tìm vị trí trống đầu tiên từ 1 đến 5
        let positionToPin = 1;
        for (let i = 1; i <= 5; i++) {
            if (!usedPositions.has(i)) {
                positionToPin = i;
                break;
            }
        }

        // Cập nhật thông tin ghim
        media.isPinned = true;
        media.pinnedPosition = positionToPin;
    } else {
        // Bỏ ghim bài viết
        media.isPinned = false;
        media.pinnedPosition = null;
    }

    return this.mediaRepository.save(media);
}

}
