import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetPagination {
  @ApiProperty({
    description: 'User code',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  user_code: string;

  @ApiProperty({
    description: 'Keyword to search in phone, fullname or email',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Keyword to search in Dooprime, Aetos, user_code maketer',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  source?: string;

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
    description: 'enum',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  tag?: string;

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

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per limit',
    required: false,
    type: Number,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
