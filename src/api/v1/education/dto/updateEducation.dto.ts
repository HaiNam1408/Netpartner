import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto {
  @ApiProperty({
    description: 'title education',
    default: 'Giao duc gioi tinh',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'attachment education',
    example: 'url',
    type: 'string',
    required: false,
  })
  @IsOptional()
  attachment: string;

  @ApiProperty({
    description: 'cover education',
    example: 'url',
    type: 'string',
    required: false,
  })
  @IsOptional()
  cover: string;

  @ApiProperty({
    description: 'title education',
    default: 'Giao duc gioi tinh abczdasdasa',
    required: false,
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'categoryId education',
    default: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: 'playListId education',
    default: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  playListId: number;

  @ApiProperty({
    description: 'pinned',
    default: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pinned: number;
}
