import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateTicketDto{

    @ApiProperty({
        description:'title ticket',
        default:'Deal luong cao gap doi'
    })
    @IsString()
    title:string

    @ApiProperty({
        description:'content ticket',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    content:string

    @ApiProperty({
        description:'ticketId ticket',
        default:1
    })
    @Type(()=>Number)
    @IsNumber()
    ticketId:number
}