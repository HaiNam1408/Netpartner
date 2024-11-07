import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from './createAnswerDto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ name: 'content' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ name: 'id' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ name: 'answers' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
