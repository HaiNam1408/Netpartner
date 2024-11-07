import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/middleware/authGuard.middleware';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { GetOverviewDto } from './dto/getOverview.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('dashboard-overview')
  @UseGuards(AuthGuard)
  async getDashboard(@Query() { user_code }: GetOverviewDto) {
    try {
      const result = await this.dashboardService.getOverview(user_code);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(null, HttpStatus.ERROR, error.message);
    }
  }
  
  @Get('personal-overview')
  @UseGuards(AuthGuard)
  async getPersonalOverview(@Query() { user_code, start_at, end_at }: GetOverviewDto) {
    try {
      const startAt = start_at ? new Date(start_at) : undefined;
      const endAt = end_at ? new Date(end_at) : undefined;

      const result = await this.dashboardService.getPersonalOverview(user_code, startAt, endAt);
      return new ResponseData<any>(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(null, HttpStatus.ERROR, error.message);
    }
  }

}
