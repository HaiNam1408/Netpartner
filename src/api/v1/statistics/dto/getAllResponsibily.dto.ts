import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional } from "class-validator";

export class GetAllResponsibilityUserDto{
    @ApiProperty({
        description: 'Date range for commissions',
        example: '2024-07-29',
        required: false
    })
    @Type(() => Date)
    @IsOptional()
    date: Date;
}