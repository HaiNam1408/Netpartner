import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuestionYtb } from "./questionYtb";
import { Type } from "class-transformer";

@Entity()
export class AnswerYtb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Type(() => Boolean)
  @Column()
  isCorrect: boolean;

  @ManyToOne(() => QuestionYtb, question => question.answers,{ onDelete: 'CASCADE' })
  question: QuestionYtb;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}