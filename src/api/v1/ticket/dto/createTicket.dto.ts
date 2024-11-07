import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTicketDto{
    @ApiProperty({
        description:'title ticket',
        default:'Deal luong cao gap doi'
    })
    @IsString()
    title:string

    @ApiProperty({
        description:'department id',
        default:'Deal luong cao gap doi'
    })
    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    departmentId:number

    @ApiProperty({
        description:'content ticket',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    content:string

    @ApiProperty({
        description:'content ticket',
        default:1
    })
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    reciverId:number
}