import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { coreValue } from "src/typeorm/enum/coreValue.enum";

export class UpdateSettingDto {
    @IsEnum(coreValue)
    @ApiProperty({enum:[
        'Giá trị cốt lõi',
        'Công bố hỗ trợ'
    ],
        required:false
    })
    @IsOptional()
    type: coreValue;

    @ApiProperty({
        description:'attachment infomation',
        format: 'binary',
        type:'string',
        required:false
    })
    @IsOptional()
    file:string

    @ApiProperty({
        description:'title infomation',
        default:'Giao duc gioi tinh abczdasdasa',
        required:false
    })
    @IsOptional()
    @IsString()
    content:string

}
