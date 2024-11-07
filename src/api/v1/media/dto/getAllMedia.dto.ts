import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllMediaDto{
    @ApiProperty({
        description:'title Media',
        default:'giao',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string

    @ApiProperty({
        description:'type Media',
        default:'giao',
        required:false
    })
    @IsOptional()
    @IsString()
    type:string

    @ApiProperty({
        description: 'Date range for commissions',
        example: ['2024-07-29 00:00:00', '2024-07-29 23:59:59'],
        required: false
    })
    @Type(() => Date)
    @IsOptional()
    @IsArray()
    @IsDate({ each: true })
    date: Date[];

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'limit Media',
        default:'10',
        required:false
    })
    @IsNumber()
    limit:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'page Media',
        default:'1',
        required:false
    })
    @IsNumber()
    page:number
}

