import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Video } from "./videoYtb";
import { AnswerYtb } from "./answerYtb";

@Entity()
export class QuestionYtb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  content: string;

  @ManyToOne(() => Video, video => video.questions,{ onDelete: 'CASCADE' })
  video: Video;

  @OneToMany(() => AnswerYtb, answer => answer.question,{ cascade: true } )
  answers: AnswerYtb[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}