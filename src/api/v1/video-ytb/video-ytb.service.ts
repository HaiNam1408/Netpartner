import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateVideoWithQuestionsDto } from './dto/createVideoYtb.dto';
import { Video } from 'src/typeorm/entities/videoYtb';
import { QuestionYtb } from 'src/typeorm/entities/questionYtb';
import { AnswerYtb } from 'src/typeorm/entities/answerYtb';
import { UserProgress } from 'src/typeorm/entities/userProgress';
import { PaginationService } from 'src/global/globalPagination';
import { TypeEducation } from 'src/typeorm/enum/typeEdu';
import { PlayList } from 'src/typeorm/entities/playList';
import { Users } from '../../../typeorm/entities/users';
import { Role } from '../../../typeorm/enum/role.enum';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(QuestionYtb)
    private questionRepository: Repository<QuestionYtb>,
    @InjectRepository(AnswerYtb)
    private answerRepository: Repository<AnswerYtb>,
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(PlayList)
    private playListRepository: Repository<PlayList>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async createVideoWithQuestions(
    dto: CreateVideoWithQuestionsDto,
  ): Promise<void> {
    try {
      const { title, youtubeLink, questions, playListId, viewers } = dto;

      // Create the new video
      const newVideo = this.videoRepository.create({
        title,
        youtubeLink,
        playListId,
        viewers,
      });
      const savedVideo = await this.videoRepository.save(newVideo);

      //Create the questions and answers
      for (const questionDto of questions) {
        const newQuestion = this.questionRepository.create({
          content: questionDto.content,
          video: savedVideo,
        });
        const savedQuestion = await this.questionRepository.save(newQuestion);

        const answers = questionDto.answers.map((answerDto) =>
          this.answerRepository.create({
            ...answerDto,
            question: savedQuestion,
          }),
        );
        await this.answerRepository.save(answers);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllVideoUser(
    userId: number,
    limit: number,
    page: number,
    type: TypeEducation,
  ): Promise<any> {
    try {
      let userProgress = await this.userProgressRepository.findOne({
        where: { user: { id: userId }, type },
        relations: ['lastWatchedVideo'],
      });

      if (!userProgress) {
        // Nếu người dùng chưa xem video nào, tạo một bản ghi mới
        const firstVideo = await this.videoRepository.findOne({
          where: {},
          order: { createdAt: 'ASC' },
        });
        if (!firstVideo) {
          throw new Error('Không có video nào trong hệ thống!');
        }
        userProgress = await this.userProgressRepository.save({
          user: { id: userId },
          lastWatchedVideo: firstVideo,
          lastCompletedOrder: 0,
          type,
          completedVideos: [],
        });
      }

      const data = await this.videoRepository.find({
        where: {
          playlist: { type },
        },
        relations: ['playlist'],
        order: {
          createdAt: 'ASC',
        },
      });

      const userVideos = data.filter((video) => {
        return Array.isArray(video.viewers) && video.viewers.includes(userId);
      });

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const dataRes = userVideos.slice(startIndex, endIndex);

      return {
        data: dataRes,
        total: dataRes.length,
        page,
        limit,
        totalPages: Math.ceil(dataRes.length / limit),
        currentVideoId: userProgress.lastWatchedVideo.id,
        completedVideos: userProgress.completedVideos,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkAnswers(
    userId: number,
    videoId: number,
    userAnswers: any,
  ): Promise<any> {
    try {
      const video = await this.videoRepository.findOne({
        where: { id: videoId },
        relations: ['questions', 'questions.answers', 'playlist'],
      });

      if (!video) {
        throw new Error('Không tìm thấy video');
      }

      let userProgress = await this.userProgressRepository.findOne({
        where: {
          user: { id: userId },
          type: video.playlist.type,
        },
        relations: ['lastWatchedVideo'],
      });

      if (!userProgress) {
        userProgress = await this.userProgressRepository.save({
          user: {
            id: userId,
          },
          type: video.playlist.type,
        });
        // throw new Error('Không tìm thấy thông tin tiến trình của người dùng');
      }

      if (
        video.questions.length > 0 &&
        video?.questions.length !== userAnswers?.length
      ) {
        throw new Error('Số lượng câu trả lời không khớp với số lượng câu hỏi');
      }

      const results = video?.questions.map((question, index) => {
        const correctAnswer = question.answers.find(
          (answer) => answer.isCorrect,
        );
        const isCorrect =
          correctAnswer && correctAnswer.id === userAnswers[index];
        return {
          questionId: question.id,
          isCorrect: isCorrect,
          correctAnswerId: correctAnswer ? correctAnswer.id : null,
        };
      });

      const allCorrect = results.every((result) => result.isCorrect);

      if (allCorrect) {
        const allNextVideo = await this.videoRepository.find({
          where: {
            createdAt: MoreThanOrEqual(video.createdAt),
          },
          order: {
            createdAt: 'ASC',
          },
        });

        const userNextVideos = allNextVideo.filter((video) => {
          return Array.isArray(video.viewers) && video.viewers.includes(userId);
        });
        const nextVideo = userNextVideos.length > 0 ? userNextVideos[0] : video;

        // Cập nhật thông tin tiến trình
        userProgress.lastWatchedVideo = nextVideo;
        if (!Array.isArray(userProgress.completedVideos)) {
          userProgress.completedVideos = [];
        }
        userProgress.completedVideos = Array.from(
          new Set([...userProgress.completedVideos, video.id]),
        );

        await this.userProgressRepository.save(userProgress);

        return {
          message: nextVideo
            ? 'Tất cả đáp án chính xác. Video mới đã được mở.'
            : 'Xin chúc mừng! Bạn đã hoàn thành tất cả các video.',
          nextVideoId: nextVideo?.id,
        };
      } else {
        return {
          success: false,
          message: 'Một số đáp án chưa chính xác. Vui lòng thử lại.',
          results: results,
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserProcess(userId: number, type: TypeEducation): Promise<any> {
    try {
      const userProgress = await this.userProgressRepository.findOne({
        where: { user: { id: userId }, type },
        select: ['completedVideos', 'id'],
      });

      if (!userProgress) {
        throw new Error('Không tìm thấy tiến trình');
      }

      const videos = await this.videoRepository.find({
        where: {
          playlist: { type },
        },
        relations: ['playlist'],
      });
      const userVideos = videos.filter((video) => {
        return (
          video.viewers &&
          video.viewers.some(
            (viewerId: any) => viewerId.trim() === userId.toString(),
          )
        );
      });

      const userCompleted = userProgress.completedVideos?.length ?? 0;

      return {
        userProcess: `${userCompleted}/${userVideos.length}`,
      };
    } catch (error) {
      // Handle error gracefully
      throw new Error(`Failed to retrieve videos: ${error.message}`);
    }
  }

  async getAllVideoWithQuestion(
    userId: number,
    limit: number,
    page: number,
    type: TypeEducation,
  ): Promise<any> {
    try {
      const order = { id: 'ASC' };
      const userInf = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        select: ['role'],
      });
      const isRoleCEO = userInf.role == Role.CEO;

      const userProgress = await this.userProgressRepository.findOne({
        where: { user: { id: userId }, type },
        relations: ['lastWatchedVideo'],
        select: ['id', 'lastWatchedVideo', 'type', 'completedVideos'],
      });

      // Lấy tất cả playlists với videos
      let query = this.playListRepository
        .createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.video', 'video')
        .leftJoinAndSelect('video.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .where('playlist.type = :type', { type });

      if (!isRoleCEO) {
        const playlists = await query.getMany();

        const filteredPlaylists = playlists.filter((playlist: any) => {
          if (playlist.video && playlist.video.length > 0) {
            // Kiểm tra xem có ít nhất 1 video nào có userId trong viewers
            return playlist?.video.some((item) => {

              return item?.viewers?.some(
                (viewerId: string) => viewerId.trim() === userId.toString(),
              );
            });
          }
          return false;
        });

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedPlaylists = filteredPlaylists.slice(
          startIndex,
          endIndex,
        );

        const paginatedResult = {
          data: paginatedPlaylists,
          total: paginatedPlaylists.length,
          limit: limit,
          totalPages: Math.ceil(filteredPlaylists.length / limit),
          page: page,

          userProgress,
        };

        return paginatedResult;
      }

      const paginatedResult: any = await PaginationService.paginate(
        this.playListRepository,
        { page, limit },
        {
          type,
        },
        ['video', 'video.questions', 'video.questions.answers'],
        {
          video: {
            id: true,
            title: true,
            youtubeLink: true,
            createdAt: true,
            playlist: true,
            questions: {
              id: true,
              content: true,
              answers: {
                id: true,
                content: true,
                isCorrect: true,
              },
            },
          },
        },
        order,
      );

      paginatedResult.userProgress = userProgress;
      return paginatedResult;
    } catch (error) {
      console.error('Error in getAllVideoWithQuestion:', error);
      throw new Error(`Failed to retrieve videos: ${error.message}`);
    }
  }

  async getVideoUserId(
    id: number,
    userId: number,
    type: TypeEducation,
  ): Promise<Video> {
    // Fetch user progress to get the last watched video
    let userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, type },
      relations: ['lastWatchedVideo'],
    });

    if (!userProgress) {
      // Nếu người dùng chưa xem video nào, tạo một bản ghi mới
      const firstVideo = await this.videoRepository.findOne({
        where: {},
        order: { createdAt: 'ASC' },
      });
      if (!firstVideo) {
        throw new Error('Không có video nào trong hệ thống!');
      }
      userProgress = await this.userProgressRepository.save({
        user: { id: userId },
        lastWatchedVideo: firstVideo,
        lastCompletedOrder: 0,
        type,
        completedVideos: [],
      });
    }

    let newUserProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, type },
      relations: ['lastWatchedVideo'],
    });
    if (!newUserProgress || !newUserProgress.lastWatchedVideo) {
      throw new Error('User progress not found or no last watched video.');
    }

    // Fetch videos that the user can access based on the last watched video order
    const accessibleVideos = await this.videoRepository.find({
      where: {
        playlist: { type },
        ...(type === TypeEducation.SUB_VIDEO
          ? {}
          : {
              createdAt: LessThanOrEqual(
                newUserProgress.createdAt
              ),
            }),
      },
      relations: ['playlist'],
      order: {
        createdAt: 'ASC',
      },
    });

    const accessibleUserVideos = accessibleVideos.filter((video) => {
      return (
        video.viewers &&
        video.viewers.some(
          (viewerId: any) => viewerId.trim() === userId.toString(),
        )
      );
    });

    // Check if the requested video is among the accessible videos
    const isVideoAccessible = accessibleUserVideos.some(
      (video) => video.id === id,
    );
    
    if (!isVideoAccessible && type !== TypeEducation.SUB_VIDEO) {
      throw new Error(
        'Bạn vui lòng hoàn thành bài học trước để được làm bài học này!',
      );
    }

    // Fetch the requested video along with its related questions and answers
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        title: true,
        youtubeLink: true,
        createdAt: true,
        questions: {
          id: true,
          content: true,
          answers: {
            id: true,
            content: true,
            isCorrect: true,
          },
        },
        viewers: true,
      },
    });

    if (!video) {
      throw new Error('Video not found.');
    }

    return video;
  }

  async getVideoId(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        title: true,
        youtubeLink: true,
        playListId: true,
        createdAt: true,
        questions: {
          id: true,
          content: true,
          answers: {
            id: true,
            content: true,
            isCorrect: true,
          },
        },
        viewers: true,
      },
    });

    if (!video) {
      throw new Error('Video not found.');
    }

    return video;
  }

  async updateVideoAndQuestion(
    id: number,
    body: CreateVideoWithQuestionsDto,
  ): Promise<any> {
    const { title, youtubeLink, questions, playListId } = body;

    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers', 'playlist'],
    });

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    // Update video properties
    Object.assign(video, { title, youtubeLink, playListId });

    // Process questions
    if (questions && questions.length > 0) {
      const processedQuestions = await Promise.all(
        questions.map(async (questionDto) => {
          let question: QuestionYtb;

          if (questionDto.id) {
            // Find existing question
            question = video.questions.find((q) => q.id === questionDto.id);

            if (!question) {
              throw new HttpException(
                `Question with id ${questionDto.id} not found`,
                HttpStatus.NOT_FOUND,
              );
            }
          } else {
            // Create new question
            question = new QuestionYtb();
            Object.assign(question, {
              content: questionDto.content,
              video, // Assign the video to the new question
            });
            console.log(question);
            await this.questionRepository.save(question);
          }

          // Process new answers
          if (questionDto.answers && questionDto.answers.length > 0) {
            const newAnswers = await Promise.all(
              questionDto.answers.map(async (answerDto) => {
                const newAnswer = new AnswerYtb();
                Object.assign(newAnswer, {
                  content: answerDto.content,
                  isCorrect: answerDto.isCorrect,
                  question,
                });

                return this.answerRepository.save(newAnswer);
              }),
            );

            // Add new answers to existing answers
            question.answers = [...(question.answers || []), ...newAnswers];
          }

          return question;
        }),
      );

      // Update video's questions, keeping existing questions and adding new ones
      const existingQuestions = video.questions.filter(
        (q) => !questions.some((newQ) => newQ.id === q.id),
      );
      video.questions = [...existingQuestions, ...processedQuestions];
    }

    // Save the updated video with new/updated questions and answers
    await this.videoRepository.save(video);

    // Fetch the updated video without circular references
    const updatedVideo = await this.videoRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers', 'playlist'],
    });

    // Create a sanitized version of the video object
    return this.sanitizeVideo(updatedVideo);
  }

  private sanitizeVideo(video: Video): any {
    return {
      id: video.id,
      title: video.title,
      youtubeLink: video.youtubeLink,
      playListId: video.playListId,
      questions: video.questions.map((question) => ({
        id: question.id,
        content: question.content,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          content: answer.content,
          isCorrect: answer.isCorrect,
        })),
      })),
      viewers: video.viewers,
    };
  }

  async deleteVideo(id: number): Promise<void> {
    const video = await this.videoRepository.findOne({
      where: { id: id },
      relations: ['questions', 'questions.answers'],
    });

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
    // Due to our cascade setup, deleting the video will also delete related questions and answers
    await this.videoRepository.remove(video);
  }

  async deleteQuestion(id: number): Promise<void> {
    const video = await this.questionRepository.findOne({
      where: { id: id },
      relations: ['answers'],
    });
    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
    await this.questionRepository.remove(video);
  }
}
