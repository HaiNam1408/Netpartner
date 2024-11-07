import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
    @ApiProperty({name: 'content'})
    @IsString()
    @IsOptional()
    content: string;

    @ApiProperty({name: 'isCorrect'})
    @Type(()=>Boolean)
    @IsBoolean()
    @IsOptional()
    isCorrect: boolean;
}