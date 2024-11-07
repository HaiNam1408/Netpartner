import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetRegisterCustomerDto {
  @ApiProperty({
    description:
      'Keyword to search in displayName, email, phone, CrawlFrom, user_manager',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'user_code',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  saler?: string;
  @ApiProperty({
    description: 'user_code',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  maketing?: string;

  @ApiProperty({
    description: 'Date range for commissions',
    example: ['2024-07-29 00:00:00', '2024-07-29 23:59:59'],
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  date: Date[];

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'limit commissions',
    default: '10',
    required: false,
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'page commissions',
    default: '1',
    required: false,
  })
  @IsNumber()
  page: number;
}
