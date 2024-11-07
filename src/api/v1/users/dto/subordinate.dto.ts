import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class Subordinate{
    @ApiProperty({
        description: ' id',
        required: false,
        type: Number,
      })
      @Type(()=>Number)
      @IsOptional()
      @IsNumber()
      id?: number;
}