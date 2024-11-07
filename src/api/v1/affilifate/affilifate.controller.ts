import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AffilifateService } from './affilifate.service';
import { CreateAffiliateDto } from './dto/createAffiliate.dto';
import { Affiliate } from 'src/typeorm/entities/Affiliate';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateAffiliateDto } from './dto/updateaffiliate.dto';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('affiliate')
@Controller('affilifate')
export class AffilifateController {
    constructor(private readonly affiliateService:AffilifateService){}

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-affiliate')
    async createAffiliate(@Body() body:CreateAffiliateDto,@Req() req):Promise<any>{
        try {
            const {id} = req.user;
            const result = await this.affiliateService.createAffiliate(body,id);
            return new ResponseData<Affiliate>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Affiliate>(null, HttpStatus.ERROR, error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Get('get-all-affiliate-link')
    async getAllAffiliateLink (@Req() req):Promise<any>{
        try {
            const {id} = req.user;
            const result = await this.affiliateService.findAllAffiliateLink(id);
            return new ResponseData<Affiliate[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Affiliate>(null, HttpStatus.ERROR, error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Get('get-affiliate-link/:id')
    async getAffiliateLinkId (@Param('id', ParseIntPipe) id:number):Promise<any>{
        try {
            const result = await this.affiliateService.findAffiliateLinkId(id);
            return new ResponseData<Affiliate>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Affiliate>(null, HttpStatus.ERROR, error.message);
        }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Patch('update-affiliate/:id')
    async updateAffiliate(@Body() body:UpdateAffiliateDto,@Param('id', ParseIntPipe) id:number):Promise<any>{
        try {
            await this.affiliateService.updateAffiliate(body,id);
            return new ResponseData<string>("Cập nhật link tiếp thị thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Affiliate>(null, HttpStatus.ERROR, error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Delete('delete-affiliate/:id')
    async deleteAffiliate(@Param('id', ParseIntPipe) idAffiliate:number,@Req() req):Promise<any>{
        try {
            const {role,id} = req.user;
            await this.affiliateService.removeAffiliate(idAffiliate,role,id);
            return new ResponseData<string>("Xóa link tiếp thị thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Affiliate>(null, HttpStatus.ERROR, error.message);
        }
    }
}
