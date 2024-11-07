import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLearningStepDto {
    @ApiProperty({
        description:'title learning_step',
        default:'1'
    })
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    userId:number

    @ApiProperty({
        description:'content learning_step',
        default:'1'
    })
    @IsOptional()
    level:string

}
