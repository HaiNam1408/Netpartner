import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSalaryDto {
    @ApiProperty({
        description:'salary_base  salary_base',
        default:'4000000'
    })
    @IsNumber()
    @Type(()=>Number)
    salary_base:number

    @ApiProperty({
        description:'salary_base  salary_base',
        default:'PHONG_HANH_CHINH'
    })
    @IsString()
    department_code:string

}
