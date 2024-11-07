import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetAttendenceQueryDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'User Id',
    example: '1',
  })
  @IsString()
  userId: number;

  @ApiProperty({
    description: 'start_at',
    default: '2024-01-27',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_at: Date;

  @ApiProperty({
    description: 'end_at',
    default: '2024-02-27',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_at: Date;
}
