export class CreateAffiliateDto{}import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AffiliateType } from "src/typeorm/enum/Affiliate.enum";

export class UpdateAffiliateDto {

    @ApiProperty({
        description:'title Affiliate',
        default:'Happy birthday',
        required:false
    })
    @IsOptional()
    @IsString()
    title:string

    @ApiProperty({
        description:'content Affiliate',
        default:'https://tippertrade.xyz/#/gioi-thieu-khach-hang?query=ACE512720&type=0',
        required:false
    })
    @IsOptional()
    @IsString()
    link:string

    @ApiProperty({
        enum:[
            'Aetos',
            'Dooprime'
        ],
        required:false
    })
    @IsOptional()
    @IsEnum(AffiliateType)
    type:AffiliateType

}
