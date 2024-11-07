import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
    @ApiProperty({
        description:'title events',
        default:'Happy birthday'
    })
    @IsNotEmpty()
    @IsString()
    title:string

    @ApiProperty({
        description:'content events',
        default:'kinh doanh'
    })
    @IsNotEmpty()
    @IsString()
    content:string

    @ApiProperty({
        description:'start_at events',
        default:'2024-01-27'
    })
    @IsNotEmpty()
    @IsDate()
    @Type(()=>Date)
    start_at:Date

}
