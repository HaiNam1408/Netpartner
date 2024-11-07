import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class GetSatisticQueryDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'User Id',
        example: '1',
    })
    @IsString()
    userId: number;

    @ApiProperty({
        description: 'start_at',
        default: '2024-01-27',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_at: Date;

    @ApiProperty({
        description: 'end_at',
        default: '2024-02-27',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_at: Date;
}
