import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
    MaxLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class forgotPasswordDTO {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({
      description: 'your email',
      default: 'daohai271@gmail.com',
    })
    email: string;
  }
  