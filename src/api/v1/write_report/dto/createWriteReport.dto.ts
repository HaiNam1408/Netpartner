import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateWriteReportDto{
    @ApiProperty({
        description:'done_task write report',
        default:'Deal luong cao gap doi'
    })
    @IsOptional()
    @IsString()
    done_task:string

    @ApiProperty({
        description:'unfinish_tasks write report',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    unfinished_tasks:string

    @ApiProperty({
        description:'well_and_continure write report',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    well_and_continue:string

    @ApiProperty({
        description:'no_do_well write report',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    no_do_well:string

    @ApiProperty({
        description:'self_assessment write report',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    self_assessment:string

    @ApiProperty({
        description:'suggestions write report',
        default:'Dung co ma tien it doi hit do thom'
    })
    @IsOptional()
    @IsString()
    suggestions:string

   
}