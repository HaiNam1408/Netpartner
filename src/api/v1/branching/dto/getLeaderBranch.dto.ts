import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNumber } from "class-validator";

export class GetLeaderBranchDto {
    @Type(()=> Number)
    @ApiProperty({
        description:'title branches',
        default:'2'
    })
    @IsNumber()
    branch_id:number
}

