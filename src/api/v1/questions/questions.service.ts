import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Questions } from 'src/typeorm/entities/question';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Questions)
        private questionRepository:Repository<Questions>
    ){}

    async createQuestions(data:CreateQuestionDto[]):Promise<void>{
        const attendanceUsers = data.map(item => this.questionRepository.create(item));
        await this.questionRepository.insert(attendanceUsers);

    }
}
