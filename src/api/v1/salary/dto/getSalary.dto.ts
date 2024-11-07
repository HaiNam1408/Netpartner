import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class GetSalaryDto {

    @ApiProperty({
        description: 'start_at',
        default: '2024-01-27',
        required: false
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({
        description: 'end_at',
        default: '2024-10-27',
        required: false
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date;
}