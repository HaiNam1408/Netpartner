import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateInvesmentDto{
    @ApiProperty({
        description:'userId',
        default:'5',
        required:false
    })
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    userId:number

    @ApiProperty({
        description:'signalIndex',
        default: 1,
        required:false
    })
    @IsOptional()
    signalIndex:boolean

    @ApiProperty({
        description:'signalIndex',
        default: 1,
        required:false
    })
    @IsOptional()
    profitIndex:boolean

}
  