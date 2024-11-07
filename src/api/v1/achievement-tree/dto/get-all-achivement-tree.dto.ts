import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import {
  ACHIEVEMENT_TREE_BASE,
  ACHIEVEMENT_TREE_TYPE,
} from '../../../utils/constants';

export class GetAllAchievementTreeDTO {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'Limit',
    default: '10',
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'Page',
    default: '1',
  })
  @IsNumber()
  page: number;

  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'User ID',
    default: '1',
  })
  @IsNumber()
  userId?: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'baseTree',
    default: ACHIEVEMENT_TREE_BASE.REGISTER_USER,
  })
  @IsNumber()
  baseTree: number;

  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'typeTree',
    default: ACHIEVEMENT_TREE_TYPE.MONTH,
  })
  @IsNumber()
  typeTree?: number;
}
