import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MilestonesTree } from './milestones-tree.entity';
import { UserProcessAchievementTree } from './user-process-achievement-tree.entity';

@Entity()
export class AchievementTree {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'base_tree' })
  baseTree: number;

  @Column({ name: 'name_tree' })
  nameTree: string;

  @Column({ name: 'type_tree' })
  typeTree: number;

  @Column({ name: 'create_at', nullable: true })
  @CreateDateColumn()
  createAt: Date;

  @Column({ name: 'update_at', nullable: true })
  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => MilestonesTree, (milestone) => milestone.achievementTree)
  milestones: MilestonesTree[];

  @OneToMany(
    () => UserProcessAchievementTree,
    (process) => process.achievementTree,
  )
  userProcesses: UserProcessAchievementTree[];
}
