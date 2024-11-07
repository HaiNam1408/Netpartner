import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class KnowledgeTree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currentLevel: number;

  @OneToOne(() => Users, user => user.knowledgeTree)
  @JoinColumn()
  user: Users;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

}