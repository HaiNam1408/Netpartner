import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {

    @ApiProperty({
        description:'attendance_code     questiong',
        default:'#Cau 1:asdasdasd'
    })
    @IsString()
    question:string

}
