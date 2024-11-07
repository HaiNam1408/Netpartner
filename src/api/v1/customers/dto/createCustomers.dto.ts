import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommissionCrawlFrom } from 'src/typeorm/enum/commission.enum';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'trading_id customer',
    default: '1',
  })
  @IsOptional()
  trading_id: string;

  @ApiProperty({
    description: 'fullname customer',
    default: 'daohai',
  })
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'email customer',
    default: '1',
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'phone customer',
    default: '1123213123123',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'date_of_birth customer',
    default: '2024/01/01',
  })
  @IsOptional()
  @IsString()
  date_of_birth: string;

  @ApiProperty({
    description: 'trading_id customer',
    default: '#1231',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  tag: string;

  @ApiProperty({
    description: 'trading_id customer',
    default: 'Aetos|Dooprime',
  })
  @IsOptional()
  @IsEnum(CommissionCrawlFrom)
  @ApiProperty({ enum: ['Aetos', 'Dooprime'] })
  CrawlFrom: CommissionCrawlFrom;

  @ApiProperty({
    description: 'saler customer',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  saler: string;

  @IsOptional()
  @IsString()
  leader: string;

  @ApiProperty({
    description: 'maketer customer',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  maketer: string;

  @ApiProperty({
    description: 'note customer',
    default: 'dadasdas',
    required: false,
  })
  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  flag_time: Date;

  @IsOptional()
  @IsString()
  create_at: Date;

  @IsOptional()
  @IsString()
  update_at: Date;
  CommissionCrawlFrom: any;
}
