import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class ResponsibilityIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  answer: string[];

  @Column('simple-array')
  point: number[];

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Users, user => user.response_manager_index)
  @JoinColumn({ name: "managerId" })
  manager: Users;

  @Column()
  managerId: number;

  @ManyToOne(() => Users, user => user.response_index)
  @JoinColumn({ name: "userId" })
  user: Users;
  
  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

}