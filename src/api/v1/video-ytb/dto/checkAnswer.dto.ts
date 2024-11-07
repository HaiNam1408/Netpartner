import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CheckAnswersDto {
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    videoId: number;

    @ApiProperty()
    @IsArray()
    @Type(() => Number)
    @IsOptional()
    @IsNumber({}, { each: true })
    userAnswers: number[];
  }