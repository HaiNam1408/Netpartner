import { Module } from '@nestjs/common';
import { VideoService } from './video-ytb.service';
import { VideoController } from './video-ytb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/typeorm/entities/videoYtb';
import { AnswerYtb } from 'src/typeorm/entities/answerYtb';
import { QuestionYtb } from 'src/typeorm/entities/questionYtb';
import { UserProgress } from 'src/typeorm/entities/userProgress';
import { PlayList } from 'src/typeorm/entities/playList';
import { Users } from '../../../typeorm/entities/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Video,
      AnswerYtb,
      QuestionYtb,
      UserProgress,
      PlayList,
      Users,
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoYtbModule {}
