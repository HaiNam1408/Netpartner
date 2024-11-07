import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class EventTitleDto {

    @ApiProperty({
        description:'start_at events',
        default:'2024-01-27'
    })
    @IsNotEmpty()
    @IsDate()
    @Type(()=>Date)
    start_at:Date

    @ApiProperty({
        description:'start_at events',
        default:'2024-02-27'
    })
    @IsNotEmpty()
    @IsDate()
    @Type(()=>Date)
    end_at:Date

}
