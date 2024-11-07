import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users";
import { LearningItem } from "./learning-item";

@Entity()
export class UserProgressTree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => Users, user => user.progresses)
  user: Users;

  @ManyToOne(() => LearningItem, item => item.progresses)
  learningItem: LearningItem;
}