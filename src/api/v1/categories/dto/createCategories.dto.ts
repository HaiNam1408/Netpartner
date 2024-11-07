import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description:'title categories',
        default:'kinh doanh'
    })
    @IsNotEmpty()
    @IsString()
    title:string

}
