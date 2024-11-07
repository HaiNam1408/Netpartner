import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUpdateMilestonesTreeDTO {
  // for create/update into achievementTree. if id is update else create
  @ApiProperty({
    description: 'Milestones Tree Id',
    default: 1,
  })
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Achievement Tree Id',
    default: 1,
  })
  @IsOptional()
  achievementTreeId?: number;

  @ApiProperty({
    description: 'Value Milestones Tree',
    default: 1,
  })
  @IsOptional()
  value: number;

  @ApiProperty({
    description: 'Desc Milestones Tree',
    default: 'Desc Milestones Tree',
  })
  @IsOptional()
  desc: string;

  @ApiProperty({
    description: 'Image Milestones Tree',
    default: 'https://www.google.com.vn/?hl=vi',
  })
  @IsOptional()
  imagePath: string;
}
