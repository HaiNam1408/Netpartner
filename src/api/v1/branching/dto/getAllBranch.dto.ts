import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNumber, IsOptional } from "class-validator";

export class GetAllBranchUser{

    @Type(()=> Number)
    @ApiProperty({
        description:'title branches',
        default:'2'
    })
    @IsNumber()
    branch_id:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'limit branches',
        default:'10'
    })
    @IsNumber()
    limit:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'page branches',
        default:'1'
    })
    @IsNumber()
    page:number
}

