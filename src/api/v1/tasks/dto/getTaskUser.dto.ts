import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional } from "class-validator";
import { TaskType } from "src/typeorm/enum/taskType";

export class GetTaskUserDto{
    @ApiProperty({
        description: 'user id',
        example: 1,
        required: false
    })
    @IsOptional()
    userId: number;

    @ApiProperty({
        description: 'user id',
        example: 1,
        required: false
    })
    @IsOptional()
    checkerId: number;

    @ApiProperty({
        description: 'type',
        example: 'Nhiệm vụ đặc thù',
        required: false,
        enum:TaskType
    })
    @IsOptional()
    type: TaskType;

    @ApiProperty({
        description: 'Date range for commissions',
        example: ['2024-07-29 00:00:00', '2024-07-29 23:59:59'],
        required: false
    })
    @Type(() => Date)
    @IsOptional()
    @IsArray()
    @IsDate({ each: true })
    date: Date[];
}