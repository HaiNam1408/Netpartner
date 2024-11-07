import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionDto } from './createQuestion.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoWithQuestionsDto {
  @ApiProperty({ name: 'title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ name: 'youtubeLink' })
  @IsString()
  @IsOptional()
  youtubeLink: string;

  @ApiProperty({ name: 'playListId' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  playListId: number;

  @ApiProperty({ name: 'questions', default: [new CreateQuestionDto()] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiProperty({ name: 'viewers', default: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  viewers: number[];
}
