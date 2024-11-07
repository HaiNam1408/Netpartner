import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdatePlayListDto{
    @ApiProperty({
        description:'title play list',
        default:'Noi xau sep7'
    })
    @IsString()
    title:string
}