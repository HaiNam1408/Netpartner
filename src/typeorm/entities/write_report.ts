import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { ResponsesTicket } from "./responsesTicket";


@Entity()
export class writeReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type:"longtext" })
  done_task: string;

  @Column({ nullable: false, type:"longtext" })
  unfinished_tasks: string;

  @Column({ nullable: false, type:"longtext" })
  well_and_continue: string;

  @Column({ nullable: false, type:"longtext" })
  no_do_well: string;

  @Column({ nullable: false, type:"longtext" })
  self_assessment: string;

  @Column({ nullable: false, type:"longtext" })
  suggestions: string;

  @ManyToOne(() => Users, user => user.write)
  @JoinColumn({ name: "userId" })
  user: Users;
  
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

}