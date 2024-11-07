import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    description: 'title education',
    default: 'Giao duc gioi tinh',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'attachment education',
    example: 'url',
    type: 'string',
    required: false,
  })
  attachment: string;

  @ApiProperty({
    description: 'cover education',
    example: 'url',
    type: 'string',
    required: false,
  })
  cover: string;

  @ApiProperty({
    description: 'title education',
    default: 'Giao duc gioi tinh abczdasdasa',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'categoryId education',
    default: '1',
  })
  @IsNotEmpty()
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
}
