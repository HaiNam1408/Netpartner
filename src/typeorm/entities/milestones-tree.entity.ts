import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { AchievementTree } from './achievement-tree.entity';
import { AchievementLog } from './achievement-log.entity';

@Entity()
export class MilestonesTree {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  value: number;

  @Column({ type: 'text' })
  desc: string;

  @Column({ name: 'image_path' })
  imagePath: string;

  @Column({ name: 'create_at', nullable: true })
  @CreateDateColumn()
  createAt: Date;

  @Column({ name: 'update_at', nullable: true })
  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'bigint' })
  achievementTreeId: number

  @ManyToOne(() => AchievementTree, tree => tree.milestones)
  @JoinColumn({ name: 'achievementTreeId' })
  achievementTree: AchievementTree;

  @OneToMany(() => AchievementLog, log => log.milestonesTree)
  achievementLogs: AchievementLog[];
}