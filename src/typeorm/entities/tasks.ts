import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assignments } from "./assignments";
import { Users } from "./users";  // Make sure to import the Users entity
import { TaskType } from "../enum/taskType";

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type:"longtext" })
  content: string;

  @Column({ nullable: true, type:"longtext" })
  note: string;

  @Column({ nullable: true, type:"longtext" })
  desc_detail: string;

  @Column({ nullable: true, type:"longtext" })
  number_content: string;

  @Column({ type: 'enum', enum: TaskType, nullable: true})
  type: string;

  @Column({ nullable: false })
  start_at: Date;

  @Column({ nullable: false })
  expire_at: Date;

  @ManyToOne(() => Users, user => user.managerTasks)
  @JoinColumn({ name: "managerId" })
  manager: Users;

  @Column()
  managerId: number;

  @ManyToOne(() => Users, user => user.checkedBy)
  @JoinColumn({ name: "checker_id" })
  checker: Users;

  @Column()
  checker_id: number
  
  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

  @OneToMany(() => Assignments, (assignment) => assignment.task)
  assignment: Assignments[];
}