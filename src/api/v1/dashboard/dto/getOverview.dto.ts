import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsDate } from 'class-validator';

export class GetOverviewDto {
  @ApiProperty({
    description: 'User code',
    type: String,
    example: 'NET0000',
  })
  @IsNotEmpty()
  @IsString()
  user_code: string;

  @ApiProperty({
    description: 'Start date for filtering',
    required: false,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_at?: Date;

  @ApiProperty({
    description: 'End date for filtering',
    required: false,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_at?: Date;
}