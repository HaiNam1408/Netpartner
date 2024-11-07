import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AffiliateType } from "src/typeorm/enum/Affiliate.enum";

export class CreateAffiliateDto {

    @ApiProperty({
        description:'title Affiliate',
        default:'Happy birthday'
    })
    @IsNotEmpty()
    @IsString()
    title:string

    @ApiProperty({
        description:'content Affiliate',
        default:'https://tippertrade.xyz/#/gioi-thieu-khach-hang?query=ACE512720&type=0'
    })
    @IsNotEmpty()
    @IsString()
    link:string

    @ApiProperty({
        default:   'Aetos | Dooprime'
    })
    @IsNotEmpty()
    @IsEnum(AffiliateType)
    type:AffiliateType

}
