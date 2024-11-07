import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { statusSupport } from "src/typeorm/enum/statusSupport.enum";

export class UpdateStatusSupportDto{
    @IsEnum(statusSupport)
    @ApiProperty({enum:[
        'Đợi tiếp nhận',
        'Đang xử lý',
        'Xử lý thành công',
        'Xử lý thất bại',
    ]})
    status: statusSupport;
}