import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { TypeMedia } from "src/typeorm/enum/typeMedia";

export class UpdateSalaryDto {
    @ApiProperty({
        description:'title media',
        default:'2000000',
        required:false
    })
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    extra_salary:number

    @ApiProperty({
        description:'title media',
        default:'2000000',
        required:false
    })
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    salary_bonus:number
}
