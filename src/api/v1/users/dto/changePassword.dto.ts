import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    description: 'your password',
    default: '********',
  })
  oldPassword: string;

  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    description: 'your password',
    default: '********',
  })
  newPassword: string;
}
