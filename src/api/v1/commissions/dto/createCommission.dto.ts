import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CommissionCrawlFrom } from 'src/typeorm/enum/commission.enum';

export class CreateCommissionDto {
  @ApiProperty({
    description: 'User manager associated with the commission',
    example: 'NET7878',
    required: false,
  })
  @IsOptional()
  @IsString()
  user_manager: string;

  @ApiProperty({
    description: 'Deal associated with the commission',
    example: '78172831',
    required: false,
  })
  @IsOptional()
  @IsString()
  deal: string;

  @ApiProperty({
    description: 'Login number associated with the commission',
    example: 12323323,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  login: number;

  @ApiProperty({
    description: 'IB number associated with the commission',
    example: 1232,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ib: number;

  @ApiProperty({
    description: 'Time associated with the commission',
    example: '2024-01-01 10:00:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Type of commission',
    example: 'Referral',
    required: false,
  })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Profit amount for the commission',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  profit: number;

  @ApiProperty({
    description: 'Comment or note for the commission',
    example: 'This is a note',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'Level associated with the commission',
    example: 'Level 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  level: string;

  @ApiProperty({
    description: 'Department name associated with the commission',
    example: 'Department 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  departmentName: string;

  @ApiProperty({
    description: 'Manager ID associated with the commission',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  manager: number;

  @ApiProperty({
    description: 'Source from which the commission was crawled',
    example: CommissionCrawlFrom.AETOS,
    enum: CommissionCrawlFrom,
    required: false,
  })
  @IsOptional()
  @IsEnum(CommissionCrawlFrom)
  CrawlFrom: CommissionCrawlFrom;
}
