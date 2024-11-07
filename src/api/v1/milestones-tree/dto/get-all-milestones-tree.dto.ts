import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsNumber } from "class-validator"

export class GetAllMilestonesTreeDTO {
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({
        description: 'Limit',
        default: '10'
    })
    @IsNumber()
    limit: number

    @Type(() => Number)
    @IsOptional()
    @ApiProperty({
        description: 'Page',
        default: '1'
    })
    @IsNumber()
    page: number
}