import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Gender } from "src/typeorm/enum/gender.enum";
import { Role } from "src/typeorm/enum/role.enum";

export class CreateDto {

    @ApiProperty({
        description:'email users',
        default:'daohai@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description:'password users',
        default:'***'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description:'fullname users',
        default:'nguyen van a'
    })
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @ApiProperty({
        description:'phone users',
        default:'0871236213'
    })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsEnum(Role)
    @ApiProperty({enum:[
        'Trợ lý',
        'Quản lý',
        'Trưởng nhóm',
        'Nhân viên sale',
        'Nhân viên marketing',
        'Admin',
        'Kế Toán',
        'Giám đốc kinh doanh',
        'Content Creater',
        'Media&Editor',
        'Chuyên viên tuyển dụng',
        'Quản lý kinh doanh'
    ]})
    duty: Role;

    @ApiProperty({
        description:'manager users',
        default:'Dao Hai',
        required:false
    })
    @IsOptional()
    @IsString()
    manager: string;

    @ApiProperty({
        description:'attendance_code users',
        default:'A8312b'
    })
    @IsNotEmpty()
    @IsString()
    attendance_code: string;

    @IsEnum(Gender)
    @ApiProperty({enum:['Nam','Nữ','Khác']})
    gender: Gender;

    @ApiProperty({
        description:'user_code users',
        default:'2024-07-21T09:21:15.915Z'
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date_of_birth: Date;

    @ApiProperty({
        description:'user_code users',
        default:'dai hoc'
    })

    @ApiProperty({
        description: 'fill to branchId user',
        default:'1',
        required:false
      })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    branchId:number

    @ApiProperty({
        description: 'fill to departmentId user',
        default:'1',
        required:false
      })
    @IsNumber()
    @Type(() => Number)
    departmentId:number

    @ApiProperty({
        description: 'fill to recuiter_code user',
        default:'NET7878',
        required:false
      })
    @IsString()
    @IsOptional()
    recuiter_code:string

    @ApiProperty({
        description: 'fill to cccd_front user',
        format: 'binary',
        type:'string'
      })
    cccd_front: string;

    @ApiProperty({
        description: 'fill to cccd_back user',
        format: 'binary',
        type:'string'
      })
    cccd_back:string;

    @ApiProperty({
        description: 'fill to avatar user',
        format: 'binary',
        type:'string'
      })
    avatar: string;

}