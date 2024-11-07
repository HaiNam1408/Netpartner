import { TypeEducation } from '../../../../typeorm/enum/typeEdu';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class getVideoUserIdDto {
  @IsOptional()
  @ApiProperty({
    description: 'type',
    default: 'SUB_VIDEO',
  })
  type: TypeEducation;
}
