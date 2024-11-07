import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetAllUserProcessAchievementTreeDTO {
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
}
