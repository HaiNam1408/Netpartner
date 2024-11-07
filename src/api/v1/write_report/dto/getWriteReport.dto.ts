import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllWriteReportDto{

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'limit write report',
        default:'10',
        required:false
    })
    @IsNumber()
    limit:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'page write report',
        default:'1',
        required:false
    })
    @IsNumber()
    page:number
}

