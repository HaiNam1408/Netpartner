import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BranchingService } from './branching.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Branching } from 'src/typeorm/entities/branching';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetLeaderBranchDto } from './dto/getLeaderBranch.dto';
import { GetAllBranchUser } from './dto/getAllBranch.dto';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
@ApiBearerAuth()
@ApiTags('branching')
@Controller('branching')
export class BranchingController {
    constructor(private branching:BranchingService){}

    @Get('get-leader-branch')
    async getLeaderBranch(@Query(){branch_id}:GetLeaderBranchDto){
        try {
            const result = await this.branching.getLeaderBranch(branch_id)
            return new ResponseData<Branching[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Branching>(null, HttpStatus.ERROR, error.message);
        }
    }

    @Get('get-all-branch-user')
    async getAllBranchUser(@Query(){branch_id,limit,page}: GetAllBranchUser){
        try {
            const result = await this.branching.getAllBranchUser(branch_id,limit,page)
            return new ResponseData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Branching>(null, HttpStatus.ERROR, error.message);
        }
    }

}
