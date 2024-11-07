import { ApiProperty } from "@nestjs/swagger";
import {  IsOptional, IsString } from "class-validator";

export class TitleBranchDto {

    @ApiProperty({
        description:'title branches',
        default:'Dao hai',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string
}

