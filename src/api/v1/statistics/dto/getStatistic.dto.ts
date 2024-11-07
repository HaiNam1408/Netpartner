import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class GetStatisticDto{
    @ApiProperty({
        description: 'user_code',
        default: 'NET7878',
        required: false
    })
    @IsOptional()
    @IsString()
    user_code: string
    
    @ApiProperty({
        description:'month',
        default:'1',
        required:false
    })
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    month:number

    @ApiProperty({
        description:'month',
        default:'1',
        required:false
    })
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    year:number
}