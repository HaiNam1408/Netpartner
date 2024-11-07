import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TypeMedia } from "src/typeorm/enum/typeMedia";

export class CreateMediaDto {
    @ApiProperty({
        description:'title media',
        default:'Giao duc gioi tinh'
    })
    
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
        default:TypeMedia
    })
    @IsNotEmpty()
    @IsString()
    type:TypeMedia

    @ApiProperty({
        description:'departmentId',
        default:'1',
        required:false
    })
    @IsOptional()
    departmentId:number


}
