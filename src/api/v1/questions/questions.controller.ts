import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Questions } from 'src/typeorm/entities/question';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/authGuard.middleware';

@ApiBearerAuth()
@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
    constructor(private questionService:QuestionsService){}

    @UseGuards(AuthGuard)
    @UseInterceptors(NoFilesInterceptor())
    @Post('create-questions')
    async createAffiliate(@Body() body:CreateQuestionDto[]){
        try {
            const result = await this.questionService.createQuestions(body);
            return new ResponseData<string>("Tạo thành công", HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<Questions>(null, HttpStatus.ERROR, error.message);
        }
    }
}
