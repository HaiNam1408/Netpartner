import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./users";
import { Tasks } from "./tasks";
import { assignmentStatus } from "../enum/assignmentStatus.enum";
import { assignmentsAcceptance } from "../enum/assignmentAcceptance.enum";

@Entity()
export class Assignments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.assignment)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ nullable: false})
  userId: number;

  @ManyToOne(() => Tasks, (task) => task.assignment)
  @JoinColumn({ name: 'taskId' })
  task: Tasks;

  @Column({ nullable: false})
  taskId: number;

  @Column({ type: 'enum', enum: assignmentStatus, nullable: true,default:assignmentStatus.PENDING })
  status: string;

  @Column({ type: 'enum', enum: assignmentsAcceptance, nullable: true,default:assignmentsAcceptance.NOT_SEEN  })
  acceptance: string;

  @Column({ nullable: true,type:"text"})
  result: string;

  @Column({ nullable: true,type:"text"})
  reason: string;

  @Column({ nullable: true })
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}