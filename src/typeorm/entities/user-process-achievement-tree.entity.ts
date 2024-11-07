import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { AchievementTree } from './achievement-tree.entity';

@Entity()
export class UserProcessAchievementTree {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  value: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'create_at', nullable: true })
  @CreateDateColumn()
  createAt: Date;

  @Column({ name: 'update_at', nullable: true })
  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'bigint' })
  achievementTreeId: number

  @ManyToOne(() => AchievementTree, tree => tree.userProcesses)
  @JoinColumn({ name: 'achievementTreeId' })
  achievementTree: AchievementTree;
}