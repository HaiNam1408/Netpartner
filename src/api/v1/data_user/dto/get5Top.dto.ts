import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class get5TopDto {
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
    description: 'Date range for commissions',
    example: 'NET7878',
    required: false,
  })
  @IsOptional()
  @IsString()
  user_code: string;
}
