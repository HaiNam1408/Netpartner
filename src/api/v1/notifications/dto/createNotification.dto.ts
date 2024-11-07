import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export function TransformStringToNumberArray() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(Number);
    }
    return value;
  });
}
export class CreateNotificationDto {
  @ApiProperty({
    description: 'title support',
    default: 'Deal luong cao gap doi',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'content support',
    default: 'Dung co ma tien it doi hit do thom',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'notification cover',
    example: 'url',
    type: 'string',
    required: false,
  })
  cover: string;

  @ApiProperty({
    description: 'department id',
    default: 'Deal luong cao gap doi',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @ApiProperty({
    description: 'Array of user IDs',
    type: Array,
    example: [1, 2, 3],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @TransformStringToNumberArray()
  userIds: number[];
}
