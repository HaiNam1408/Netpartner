import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { typeSupport } from 'src/typeorm/enum/typeSupport.enum';

export class PaginationSupportDto {
  @ApiProperty({
    description: 'Type support',
    required: false,
    enum: typeSupport,
  })
  @IsOptional()
  type?: typeSupport;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'limit support',
    default: '10',
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'page support',
    default: '1',
  })
  @IsNumber()
  page: number;
}
