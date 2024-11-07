import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class UserOnlineDto{
    @ApiProperty({
        description:'userId of user',
        default:'1'
    })
    @Type(()=> Number)
    @IsNumber()
    userId:number

    @ApiProperty({
        description:'online time of user',
        default:'1'
    })
    @Type(()=> Number)
    @IsNumber()
    time:number
}