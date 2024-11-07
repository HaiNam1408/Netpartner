import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Branches } from 'src/typeorm/entities/branches';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { TitleBranchDto } from './dto/title-branch.dto';
import { RolesGuard } from 'src/middleware/roleGuard.middleware';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from 'src/typeorm/enum/role.enum';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { GetUserCodeDto } from './dto/getUserCode.dto';
import { PaginationBranchDto } from './dto/paginationBranch.dto';

@ApiBearerAuth()
@ApiTags('branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  //create branches
  @UseGuards(AuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create-branches')
  async create(@Body() body: CreateBranchDto, @Req() req) {
    try {
      await this.branchesService.createBranches(body);
      return new ResponseData<String>(
        'Tạo branches thành công',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @Get('find-branches-title')
  async findAll(@Query() { title }: TitleBranchDto) {
    try {
      const result = await this.branchesService.findBranchesFollowName(title);
      return new ResponseData<Branches[]>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-list-subordinates')
  async findListSubordinates(@Query() { user_code }: GetUserCodeDto) {
    try {
      const result = await this.branchesService.findListSubordinates(user_code);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('find-branches/:id')
  async findBranchId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.branchesService.getBranchId(id);
      return new ResponseData<Branches>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @Patch('update-branches/:id')
  @UseInterceptors(NoFilesInterceptor())
  async updateBranches(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    try {
      await this.branchesService.updateBranches(id, updateBranchDto);
      return new ResponseData<String>(
        'Cập nhật thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.CEO)
  @Delete('delete-branches/:id')
  async removeBranches(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.branchesService.removeBranches(id);
      return new ResponseData<String>(
        'Xoá thành công!',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('total-rebate')
  async getTotalRebate() {
    try {
      const result = await this.branchesService.calculateTotalRebate();
      return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('statictis-branch')
  async statictisBranch(@Req() req) {
    try {
      const { user_code } = req.user;
      const result = await this.branchesService.getStatistics(user_code);
      return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('statictis-branch-list-staff')
  async statictisListBranch(
    @Req() req,
    @Query() { page, limit }: PaginationBranchDto,
  ) {
    try {
      const { user_code } = req.user;
      const result = await this.branchesService.getDetailBranchStaff(
        user_code,
        page,
        limit,
      );
      return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<Branches>(null, HttpStatus.ERROR, error.message);
    }
  }
}
