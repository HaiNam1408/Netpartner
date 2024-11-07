import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeEducation } from '../../../../typeorm/enum/typeEdu';

export class getUserProcessDto {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'userID',
    default: '10',
  })
  @IsNumber()
  userId: number;

  @IsOptional()
  @ApiProperty({
    description: 'type',
    default: 'SUB_VIDEO',
  })
  type: TypeEducation;
}
