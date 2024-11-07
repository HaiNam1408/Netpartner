import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class QueryDto{
    @ApiProperty({
        description:"user id",
        default:'1'
    })
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    userId:number
}