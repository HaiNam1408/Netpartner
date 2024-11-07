import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'Tiêu đề thông báo',
    example: 'Cập nhật tiêu đề',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Nội dung thông báo',
    example: 'Nội dung mới',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @ApiProperty({
    description:'notification cover',
    example: 'url',
    type:'string',
    required:false
})
cover:string
}
