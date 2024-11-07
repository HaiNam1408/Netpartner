import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/typeorm/enum/role.enum';
import { StatusUser } from 'src/typeorm/enum/statusUser.enum';


export class QueryUserDto {
  @ApiProperty({
    description: 'Keyword to search in user_code, email, phone, or fullname',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Branch ID to filter users',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  branch_id?: number;

  @ApiProperty({
    description: 'Department ID to filter users',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  department_id?: number;

  @ApiProperty({
    description: 'User role',
    required: false,
    enum: Role,
  })
  @IsOptional()
  role?: Role;

  @ApiProperty({
    description: 'User status',
    required: false,
    enum: StatusUser,
  })
  @IsOptional()
  status?: StatusUser;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}