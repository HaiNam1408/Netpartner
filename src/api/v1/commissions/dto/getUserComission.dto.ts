import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetUserCommissionDto {
  @ApiProperty({
    description: 'User code',
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  user_code: string;

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
