import { ApiProperty } from "@nestjs/swagger";
import {  IsString } from "class-validator";

export class CategoryTitleDto {

    @ApiProperty({
        description:'title category',
        default:'kinh doanh'
    })
    @IsString()
    title:string
}

