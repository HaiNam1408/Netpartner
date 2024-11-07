import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class SalaryBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default:0 })
  salary_base: number;

  @Column({ nullable: true, length: 100 })
  department_code: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;


}