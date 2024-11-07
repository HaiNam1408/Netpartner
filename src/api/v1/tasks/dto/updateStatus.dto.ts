import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateStatusDto{
    @ApiProperty({
        description:'nguoi duoc giao sua trang thai',
        default:'Hoàn thành | Bị trễ | Chưa hoàn thành',
        required:false
    })
    @IsOptional()
    @IsString()
    status:string

    @ApiProperty({
        description:'nguoi duoc giao kiem tra sua trang thai',
        default:'Chưa xem | Đạt | Chưa đạt',
        required:false
    })
    @IsOptional()
    @IsString()
    acceptance:string

    @ApiProperty({
        description:'result',
        default:'aloooooooooooooooooooooooooooooooooooooooo',
        required:false
    })
    @IsOptional()
    @IsString()
    result:string

    @ApiProperty({
        description:'reason',
        default:'aloooooooooooooooooooooooooooooooooooooooo',
        required:false
    })
    @IsOptional()
    @IsString()
    reason:string
}