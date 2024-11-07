import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateInfomationDto {
    @ApiProperty({
        description:'title infomation',
        default:'Giao duc gioi tinh'
    })
    @IsNotEmpty()
    @IsString()
    title:string

    @ApiProperty({
        description:'attachment infomation',
        format: 'binary',
        type:'string',
        required:false
    })
    file:string

    @ApiProperty({
        description:'cover infomation',
        format: 'binary',
        type:'string',
        required:false
    })
    cover:string

    @ApiProperty({
        description:'title infomation',
        default:'Giao duc gioi tinh abczdasdasa'
    })
    @IsNotEmpty()
    @IsString()
    content:string

}
