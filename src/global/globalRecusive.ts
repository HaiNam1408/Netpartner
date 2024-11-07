import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/users';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';
import { Repository } from 'typeorm';

export class GlobalRecusive {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllSubordinateUserCodes(managerCode: string): Promise<string[]> {
    // Lấy tất cả người dùng trong hệ thống cùng với manager và trạng thái
    const allUsers = await this.usersRepository.find({
      select: ['user_code', 'manager'],
      where: {
        delete_at: false,
        status: StatusUser.ACTIVE,
      },
    });

    // Chuyển dữ liệu về dạng map để tra cứu nhanh
    const userMap = new Map<string, string[]>();
    for (const user of allUsers) {
      if (user.manager) {
        if (!userMap.has(user.manager)) {
          userMap.set(user.manager, []);
        }
        userMap.get(user.manager).push(user.user_code);
      }
    }

    let queue: string[] = [managerCode];
    let allSubordinates: string[] = [];

    // BFS để lấy các cấp dưới trong bộ nhớ
    while (queue.length > 0) {
      const currentManager = queue.shift();

      const subordinates = userMap.get(currentManager) || [];

      allSubordinates = allSubordinates.concat(subordinates);
      queue = queue.concat(subordinates);
    }

    return allSubordinates;
  }
}
