import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class StatisticUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  department: string;

  @Column({ type: 'float', nullable: true })
  kpi: number;

  @Column({ type: 'float', nullable: true })
  edu: number;

  @Column({ type: 'float', nullable: true })
  responsibility: number;

  @Column({ type: 'float', nullable: true })
  attendance: number;
  
  @ManyToOne(() => Users, user => user.statistics)
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