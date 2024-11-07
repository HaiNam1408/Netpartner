import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { TaskType } from "src/typeorm/enum/taskType"

export class CreateTaskDto{
    @ApiProperty({
        description:'title task',
        default:'Dev'
    })
    @IsString()
    @IsNotEmpty()
    title:string

    @ApiProperty({
        description:'content task',
        default:'Dao hai'
    })
    @IsString()
    content:string

    @ApiProperty({
        description:'content task',
        default:'Dao hai'
    })
    @IsOptional()
    @IsString()
    note:string

    @ApiProperty({
        description:'desc_detail task',
        default:'Dao hai'
    })
    @IsOptional()
    @IsString()
    desc_detail:string

    @ApiProperty({
        description:'number_content task',
        default:'Dao hai'
    })
    @IsOptional()
    @IsString()
    number_content:string

    @ApiProperty({
        description:'content task',
        default:'Nhiệm vụ đặc thù'
    })
    @IsOptional()
    @IsString()
    type:TaskType

    @ApiProperty({
        description:'start_at task',
        default:'2024-07-24 21:10:54.436927'
    })
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    start_at: Date

    @ApiProperty({
        description:'expire_at task',
        default:'2024-07-28 21:10:54.436927'
    })
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    expire_at: Date

    @ApiProperty({
        description:'checker_id task',
        default:'1'
    })
    @IsNotEmpty()
    @Type(()=>Number)
    @IsNumber()
    checker_id:number

    @ApiProperty({
        description:'user_id task',
        default:'1'
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(()=>Number)
    userId: number

}