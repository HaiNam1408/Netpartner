import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class GetStatisticUserDto{
    @ApiProperty({
        description:'user_code',
        default:'NET7878',
        required:false
    })
    @IsOptional()
    @IsString()
    user_code:string

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
        default: '2024-02-27',
        required: false
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date;
}