import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionYtb } from './questionYtb';
import { PlayList } from './playList';
import { UserProgress } from './userProgress';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  youtubeLink: string;

  @Column({ type: 'simple-array', nullable: true })
  viewers: number[];

  @OneToMany(() => QuestionYtb, (question) => question.video, { cascade: true })
  questions: QuestionYtb[];

  @OneToMany(
    () => UserProgress,
    (userprogress) => userprogress.lastWatchedVideo,
    { cascade: true },
  )
  user_progress: UserProgress[];

  @ManyToOne(() => PlayList, (playlist) => playlist.video, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playListId' })
  playlist: PlayList;

  @Column({ nullable: true })
  playListId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
