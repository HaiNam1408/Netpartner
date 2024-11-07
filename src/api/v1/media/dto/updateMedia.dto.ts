import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { TypeMedia } from "src/typeorm/enum/typeMedia";

export class UpdateMediaDto {
    @ApiProperty({
        description:'title media',
        default:'Giao duc gioi tinh',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string

    @ApiProperty({
        description:'attachment media',
        format: 'binary',
        type:'string',
        required:false
    })
    @IsOptional()
    file:string

    @ApiProperty({
        description:'title media',
        default:'Giao duc gioi tinh abczdasdasa',
        required:false
    })
    @IsOptional()
    @IsString()
    content:string

    @ApiProperty({
        description:'link youtube media',
        default:'http:yutube?fukada',
        required:false
    })
    @IsOptional()
    @IsString()
    link:string

    @ApiProperty({
        description:'link youtube media',
        default:'http:yutube?fukada',
        required:false
    })
    @IsOptional()
    @IsString()
    type:TypeMedia

    @ApiProperty({
        description:'departmentId',
        default:'http:yutube?fukada'
    })
    @IsOptional()
    departmentId:number


}
