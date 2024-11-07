import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EventEnum } from 'src/typeorm/enum/Event.enum';

export class UpdateStatusTicketDto {
  @IsEnum(EventEnum)
  @ApiProperty({ enum: ['Tiếp nhận', 'Hoàn thành', 'Đang xử lý'] })
  status: EventEnum;
}
