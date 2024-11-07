import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { TypeEducation } from "src/typeorm/enum/typeEdu";

export class CreatePlayListDto{
    @ApiProperty({
        description:'title play list',
        default:'Noi xau sep'
    })
    @IsString()
    title:string

    @ApiProperty({
        description:'type play list',
        default:'Video'
    })
    @IsOptional()
    @IsString()
    type: TypeEducation;
}