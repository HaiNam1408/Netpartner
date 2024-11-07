import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from 'src/typeorm/entities/education';
import { CreateEducationDto } from './dto/createEducation.dto';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { UpdateEducationDto } from './dto/updateEducation.dto';
import { deleteFile } from 'src/global/globalFile';
import {
  PaginatedResult,
  PaginationService,
} from 'src/global/globalPagination';
import { TypeEducation } from 'src/typeorm/enum/typeEdu';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
  ) {}

  async createEducation(
    data: CreateEducationDto,
    user_id: number,
  ): Promise<Education> {
    return this.educationRepository.save({ ...data, authorId: user_id });
  }

  async findAllEducation(
    title?: string,
    categoryId?: number,
    playListId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Education>> {
    const where: Partial<any> = {
      playlist: { type: TypeEducation.POST },
      pinned: IsNull(),
    };

    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (playListId) {
      where.playListId = playListId;
    }
    const select = {
      id: true,
      title: true,
      cover: true,
      create_at: true,
      views: true,
      pinned: true,
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
      category: {
        id: true,
        title: true,
      },
      playlist: {
        id: true,
        title: true,
      },
    };

    const orderBy = {
      create_at: 'DESC',
    };

    const [dataPinned, countPinned] =
      await this.educationRepository.findAndCount({
        where: {
          playlist: {
            type: TypeEducation.POST,
          },
          ...(title ? { title: Like(`%${title}%`) } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(playListId ? { playListId } : {}),
          pinned: Not(IsNull()),
        },
        order: {
          pinned: 'ASC',
        },
      });

    const dataPaginated = await PaginationService.paginate<Education>(
      this.educationRepository,
      { page, limit: page == 1 ? limit - countPinned : limit },
      where,
      ['user', 'category', 'playlist'],
      select,
      orderBy,
    );

    return {
      ...dataPaginated,
      data:
        page == 1 ? [...dataPinned, ...dataPaginated.data] : dataPaginated.data,
    };
  }

  async findEducationId(id: number) {
    const select = {
      id: true,
      title: true,
      content: true,
      cover: true,
      attachment: true,
      create_at: true,
      views: true,
      pinned: true,
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
      category: {
        id: true,
        title: true,
      },
      playlist: {
        id: true,
        title: true,
      },
    };
    const check = await this.educationRepository.findOne({
      relations: ['user', 'category', 'playlist'],
      select,
      where: {
        id,
      },
    });
    if (!check) throw new Error('Không tìm thấy id bài viết này');
    check.views++;
    await this.educationRepository.update(id, check);
    return check;
  }

  async updateEducation(data: UpdateEducationDto, id: number) {
    const { pinned } = data;
    let pinnedReq = pinned;

    const educationToUpdate = await this.educationRepository.findOneBy({ id });
    if (!educationToUpdate) {
      throw new Error('Id không tồn tại');
    }
    if (data.attachment) {
      await deleteFile(`./${educationToUpdate.attachment}`);
    }
    if (data.cover) {
      await deleteFile(`./${educationToUpdate.cover}`);
    }

    if (pinned) {
      const educationDuplicate = await this.educationRepository.findOneBy({
        pinned,
      });
      if (educationDuplicate && educationToUpdate.pinned != pinned) {
        throw new Error(`Đã tồn tại bài viết ghim ở vị trí số ${pinned}`);
      }
    } else {
      pinnedReq = null;
    }

    Object.assign(educationToUpdate, {
      ...data,
      pinned: pinnedReq,
    });
    return this.educationRepository.save(educationToUpdate);
  }

  async removeEducation(id: number) {
    const check = await this.educationRepository.findOneBy({ id });
    if (!check) {
      throw new Error('Id không tồn tại');
    }
    if (check.attachment) {
      await deleteFile(`./${check.attachment}`);
    }
    if (check.cover) {
      await deleteFile(`./${check.cover}`);
    }
    return this.educationRepository.delete(id);
  }
}
