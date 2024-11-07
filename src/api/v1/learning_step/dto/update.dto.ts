import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateLearningDto {
    @ApiProperty({
        description:'title learning_step',
        default:'Happy birthday'
    })
    @IsOptional()
    @IsString()
    title:string

    @ApiProperty({
        description:'content learning_step',
        default:'kinh doanh'
    })
    @IsOptional()
    @IsString()
    content:string

    @ApiProperty({
        description:'level learning_step',
        default:'1'
    })
    @IsOptional()
    level:string

    @ApiProperty({
        description:'departmentId',
        default:'1'
      })
      @IsOptional()
    departmentId:number

}
