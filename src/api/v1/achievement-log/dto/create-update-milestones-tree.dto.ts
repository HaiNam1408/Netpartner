import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUpdateAchievementLogDTO {
  @ApiProperty({
    description: 'Milestones Tree Id',
    default: 1,
  })
  @IsOptional()
  milestonesTreeId?: number;

  @ApiProperty({
    description: 'Is Done',
    default: false,
  })
  @IsOptional()
  isDone: boolean;

  @ApiProperty({
    description: 'User Id',
    default: 1,
  })
  @IsOptional()
  userId: number;

  @ApiProperty({
    description: 'Desc AchievementLog',
    default: 'Desc AchievementLog',
  })
  @IsOptional()
  desc: string;

  @ApiProperty({
    description: 'Image AchievementLog',
    default: 'https://www.google.com.vn/?hl=vi',
  })
  @IsOptional()
  imagePath: string;
}
