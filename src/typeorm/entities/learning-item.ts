import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LearningPath } from "./learing-path";
import { UserProgressTree } from "./user-progress";

@Entity()
export class LearningItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => LearningPath, path => path.items)
  learningPath: LearningPath;

  @Column()
  learningPathId:number

  @OneToMany(() => UserProgressTree, progress => progress.learningItem)
  progresses: UserProgressTree[];

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

}