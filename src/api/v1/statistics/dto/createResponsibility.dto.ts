import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class createResponsibility{
    @ApiProperty({
        description: 'userId',
        default: '5',
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    userId: number;

    @ApiProperty({
        description: 'Array of answers',
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    answer: string[];

    @ApiProperty({
        description: 'Array of points',
        required: false
    })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
          return value.map(item => Number(item)); // Chuyển đổi từng phần tử từ chuỗi sang số
        }
        return [];
      }, { toClassOnly: true })
    point: number[];

    @ApiProperty({
        description:'note',
        default:'note'
    })
    @IsOptional()
    @IsString()
    note: string;
}