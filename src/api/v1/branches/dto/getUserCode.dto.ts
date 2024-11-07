import { ApiProperty } from "@nestjs/swagger";

export class GetUserCodeDto{
    @ApiProperty({
        description:'user_code branch',
        default:'NET7878'
    })
    user_code:string
}