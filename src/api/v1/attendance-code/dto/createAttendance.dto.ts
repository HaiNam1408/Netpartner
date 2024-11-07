import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateAttendanceCodeDto {

    @ApiProperty({
        description:'attendance_code Attendance_code',
        default:'#13132fa'
    })
    @IsNotEmpty()
    @IsString()
    attendance_code:string

    @ApiProperty({
        description:'check_in Attendance_code',
        default:'#13132fa'
    })
    @IsNotEmpty()
    @IsString()
    check_in:string

    @ApiProperty({
        description:'check_out Attendance_code',
        default:'#13132fa'
    })
    @IsNotEmpty()
    @IsString()
    check_out:string

   



}
