import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { CreateUpdateMilestonesTreeDTO } from "../../milestones-tree/dto/create-update-milestones-tree.dto"

export class CreateUpdateAchievementTreeDTO {
    @ApiProperty({
        description: 'Name Achievement Tree',
        default: 'Achievement Tree'
    })
    @IsOptional()
    @IsString()
    nameTree: string

    @ApiProperty({
        description: 'Type Achievement Tree',
        default: 0
    })
    @IsOptional()
    typeTree: number

    @ApiProperty({
        description: 'Data Milestones Tree',
        default: []
    })
    @IsOptional()
    dataMilestonesTree: CreateUpdateMilestonesTreeDTO[]
}