import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSalaryBase{
    @ApiProperty({
        description:'departmentCode',
        default:'2000000',
        required:false
    })
    @IsOptional()
    @IsString()
    department_code:string

    @ApiProperty({
        description:'salary base',
        default:'2000000',
        required:false
    })
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    salary_base:number
    
}