import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class CreateUpdateUserProcessAchievementTreeDTO {
    @ApiProperty({
        description: 'User Process Achievement Tree Id',
        default: 1
    })
    @IsOptional()
    achievementTreeId: number

    @ApiProperty({
        description: 'Value UserProcess Achievement Tree',
        default: 1
    })
    @IsOptional()
    value: number

    @ApiProperty({
        description: 'User Id',
        default: 1
    })
    @IsOptional()
    userId: number
}