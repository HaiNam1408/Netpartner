import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { TypeEducation } from '../../../../typeorm/enum/typeEdu';

export class getPaginationVideo {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'limit video',
    default: '10',
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'page video',
    default: '1',
  })
  @IsNumber()
  page: number;

  @IsOptional()
  @ApiProperty({
    description: 'type',
    default: 'SUB_VIDEO',
  })
  type: TypeEducation;
}
