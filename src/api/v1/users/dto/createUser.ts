import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateUser {
    @ApiProperty({
        description: 'fill to user_code user',
        default:'a12ed'
      })
    user_code:string
}

export class IdLeaderDto{
  @Type(()=> Number)
  @ApiProperty({
    description: 'fill to user_id user',
    default:'1'
  })
  user_id:number
}