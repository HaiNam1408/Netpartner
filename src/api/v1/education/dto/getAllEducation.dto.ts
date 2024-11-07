import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllBEducationDto{
    @ApiProperty({
        description:'title education',
        default:'giao',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string

    @Type(()=> Number)
    @ApiProperty({
        description:'categoryId education',
        default:'1',
        required:false
    })
    @IsNumber()
    @IsOptional()
    categoryId:number

    @Type(()=> Number)
    @ApiProperty({
        description:'playListId education',
        default:'1',
        required:false
    })
    @IsNumber()
    @IsOptional()
    playListId:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'limit education',
        default:'10',
        required:false
    })
    @IsNumber()
    limit:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'page education',
        default:'1',
        required:false
    })
    @IsNumber()
    page:number
}

