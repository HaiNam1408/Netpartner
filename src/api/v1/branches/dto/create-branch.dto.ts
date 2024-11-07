import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDto {
    @ApiProperty({
        description:'name branches',
        default:'Dev'
    })
    name:string

    @ApiProperty({
        description:'manager branches',
        default:'Dao hai'
    })
    manager:string
}
