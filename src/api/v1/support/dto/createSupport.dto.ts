import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { statusSupport } from 'src/typeorm/enum/statusSupport.enum';
import { typeSupport } from 'src/typeorm/enum/typeSupport.enum';

export class CreateSupportDto {
  @ApiProperty({
    description: 'title support',
    default: 'Deal luong cao gap doi',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'content support',
    default: 'Dung co ma tien it doi hit do thom',
    required: false,
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'attachment support',
    example: 'url',
    type: 'string',
    required: false,
  })
  @IsOptional()
  file: string;

  @ApiProperty({
    description: 'file support',
    example: 'url',
    type: 'string',
    required: false,
  })
  @IsOptional()
  cover: string;

  @IsEnum(typeSupport)
  @IsOptional()
  @ApiProperty({ enum: ['Hỗ trợ', 'Góp ý', 'Sứ giả hòa bình'] })
  type: typeSupport;
}
