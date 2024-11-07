import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateInfomationDto {
    @ApiProperty({
        description:'title infomation',
        default:'Giao duc gioi tinh',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string

    @ApiProperty({
        description:'attachment infomation',
        format: 'binary',
        type:'string',
        required:false
    })
    @IsOptional()
    file:string

    @ApiProperty({
        description:'cover infomation',
        format: 'binary',
        type:'string',
        required:false
    })
    @IsOptional()
    cover:string

    @ApiProperty({
        description:'title infomation',
        default:'Giao duc gioi tinh abczdasdasa',
        required:false
    })
    @IsOptional()
    @IsString()
    content:string

}
