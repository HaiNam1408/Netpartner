import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator"

export class PaginationSalaryDto{

    @ApiProperty({
        description: 'Keyword to search in , userId, salary_bonus',
        required: false,
        type: String,
      })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiProperty({
        description: 'Date range for salary',
        example: ['2024-07-29 00:00:00', '2024-07-29 23:59:59'],
        required: false
    })
    @Type(() => Date)
    @IsOptional()
    @IsArray()
    @IsDate({ each: true })
    date: Date[];

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'limit salary',
        default:'10',
        required:false
    })
    @IsNumber()
    limit:number

    @Type(()=> Number)
    @IsOptional()
    @ApiProperty({
        description:'page salary',
        default:'1',
        required:false
    })
    @IsNumber()
    page:number
}