import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default:0 })
  salary_base: number;

  @Column({ nullable: true, default:0 })
  extra_salary: number;

  @Column({ nullable: true, default:0 })
  salary_bonus: number;

  @ManyToOne(() => Users, user => user.salary)
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