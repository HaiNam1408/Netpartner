import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDepartmentDto {
    @ApiProperty({
        description:'name department',
        default:'Phòng kinh doanh'
    })
    @IsNotEmpty()
    @IsString()
    name:string

    @ApiProperty({
        description:'code khong the thay doi',
        default:'Phòng kinh doanh'
    })
    @IsNotEmpty()
    @IsString()
    code:string

}
