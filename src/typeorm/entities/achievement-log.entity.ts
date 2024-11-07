import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MilestonesTree } from './milestones-tree.entity';

@Entity()
export class AchievementLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'is_done', nullable: true })
  isDone: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  desc: string;

  @Column({ name: 'image_path' })
  imagePath: string;

  @Column()
  milestonesTreeId: number;

  @ManyToOne(() => MilestonesTree, (milestone) => milestone.achievementLogs)
  @JoinColumn({ name: 'milestonesTreeId' })
  milestonesTree: MilestonesTree;
}
