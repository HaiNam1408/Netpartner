import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  signal: boolean;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true})
  kpi: boolean;

  @Column({ nullable: true })
  edu: boolean;

  @Column({ nullable: true })
  responsibility: boolean;

  @Column({ nullable: true })
  attendance: boolean;

  @Column({ nullable: true })
  profitIndex: boolean;
  
  @ManyToOne(() => Users, user => user.statistic)
  @JoinColumn({ name: "userId" })
  user: Users;
  
  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

}