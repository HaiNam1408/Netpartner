import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class CreateLearningItemDto {
    @IsString()
    name: string;
  }

export class CreateLearningPathDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLearningItemDto)
    items?: CreateLearningItemDto[];

    @ApiProperty({
      description:'departmentId',
      default:'1'
    })
    @IsOptional()
    departmentId:number
  }
