import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users';
import { Video } from './videoYtb';
import { TypeEducation } from '../enum/typeEdu';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Video, (video) => video.user_progress, {
    onDelete: 'CASCADE',
  })
  lastWatchedVideo: Video;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: TypeEducation.POST,
  })
  type: TypeEducation;

  @Column({ type: 'simple-array', nullable: true })
  completedVideos: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
