import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
 
  @ApiProperty({
    description: 'your email',
    default: 'daohai1@gmail.com',
  })
  @IsString()
  email: string;

  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    description: 'your password',
    default: '********',
  })
  password: string;
}