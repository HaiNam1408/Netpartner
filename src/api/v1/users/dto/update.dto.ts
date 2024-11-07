import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Gender } from "src/typeorm/enum/gender.enum";
import { Role } from "src/typeorm/enum/role.enum";
import { StatusUser } from "src/typeorm/enum/statusUser.enum";

export class UpdateUserDto {
    @ApiProperty({
        description:'user_code users',
        required:false
    })
    @IsOptional()
    @IsString()
    user_code: string;

    @ApiProperty({
        description:'email users',
        required:false
    })
    @IsOptional()
    @IsString()
    email: string;


    @ApiProperty({
        description:'fullname users',
        required:false
    })
    @IsOptional()
    @IsString()
    fullname: string;

    @ApiProperty({
        description:'phone users',
        required:false
    })
    @IsOptional()
    @IsString()
    phone: string;

    @IsEnum(Role)
    @ApiProperty({enum:['CEO',
        'Trợ lý',
        'Quản lý',
        'Trưởng nhóm',
        'Nhân viên sale',
        'Nhân viên marketing',
        'Thực tập sinh',
        'Admin',
        'Kế Toán',
        'Giám đốc kinh doanh',
        'Content Creater',
        'Media&Editor',
        'Chuyên viên tuyển dụng',
        'Quản lý kinh doanh'
    ],
    required:false
    })
    @IsOptional()
    role: Role;

    @IsEnum(Role)
    @ApiProperty({enum:['CEO',
        'Trợ lý',
        'Quản lý',
        'Trưởng nhóm',
        'Nhân viên sale',
        'Nhân viên marketing',
        'Thực tập sinh',
        'Admin',
        'Kế Toán',
        'Giám đốc kinh doanh',
        'Content Creater',
        'Media&Editor',
        'Chuyên viên tuyển dụng',
        'Quản lý kinh doanh'
    ],
    required:false
    })
    @IsOptional()
    duty: Role;

    @ApiProperty({
        description:'manager users',
        required:false
    })
    @IsOptional()
    @IsString()
    manager: string;

    @ApiProperty({
        description:'accountBank users',
        required:false
    })
    @IsOptional()
    @IsString()
    accountBank: string;

    @ApiProperty({
        description:'attendance_code users',
        required:false
    })
    @IsOptional()
    @IsString()
    attendance_code: string;


    @ApiProperty({
        description: 'fill to CV user',
        format: 'binary',
        type:'string',
        required:false
      })
    @IsOptional()
    CV: string;

    @IsOptional()
    @IsEnum(Gender)
    @ApiProperty({
        enum:['Nam','Nữ','Khác'],
        required:false
    })
    gender: Gender;

    
    @ApiProperty({
        description:'date_of_birth users',
        required:false
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    date_of_birth: Date;

    @IsOptional()
    @ApiProperty({
        description: 'fill to branchId user',
        default:'1',
        required:false
      })
    @IsNumber()
    @Type(() => Number)
    branchId:number

    @ApiProperty({
        description: 'fill to departmentId user',
        default:'1',
        required:false
      })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    departmentId:number

    @IsOptional()
    @ApiProperty({
        default:"Hoạt động",
        required:false
    })
    status: StatusUser;

    @IsOptional()
    @ApiProperty({
        description: 'fill to cccd_front user',
        format: 'binary',
        type:'string',
        required:false
      })
    cccd_front: string;

    @ApiProperty({
        description: 'fill to cccd_back user',
        format: 'binary',
        type:'string',
        required:false
      })
    @IsOptional()
    cccd_back:string;

    @ApiProperty({
        description: 'fill to avatar user',
        format: 'binary',
        type:'string',
        required:false
      })
    @IsOptional()
    avatar: string;

}