import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationNotificationDto {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'limit education',
    default: '10',
    required: false,
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'page education',
    default: '1',
    required: false,
  })
  @IsNumber()
  page: number;
}
