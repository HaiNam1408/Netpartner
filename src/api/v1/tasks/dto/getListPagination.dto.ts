import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { TaskType } from 'src/typeorm/enum/taskType';

export class getListPagination {
  @ApiProperty({
    description: 'Type of the task',
    example: 'Nhiệm vụ đặc thù',
    required: false,
    enum: TaskType,
  })
  @IsOptional()
  type: TaskType;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'Limit for the number of assignments',
    default: 10,
  })
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Start date for filtering assignments',
    required: false,
    example: '2024-10-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  start_at?: Date;

  @ApiProperty({
    description: 'End date for filtering assignments',
    required: false,
    example: '2024-10-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  end_at?: Date;
}