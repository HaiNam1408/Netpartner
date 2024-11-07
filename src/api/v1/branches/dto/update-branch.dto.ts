
import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBranchDto {
    @ApiProperty({
        description:'name branches',
        default:'Dev'
    })
    @IsString()
    @IsOptional()
    name:string

    @ApiProperty({
        description:'manager branches',
        default:'Dao hai'
    })
    @IsString()
    @IsOptional()
    manager:string
}

