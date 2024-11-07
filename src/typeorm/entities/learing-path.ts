import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LearningItem } from "./learning-item";
import { Department } from "./department";

@Entity()
export class LearningPath {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  level: number;

  @Column()
  order: number;

  @ManyToOne(() => Department, (department) => department.learningPath)
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  departmentId: number;
  
  @OneToMany(() => LearningItem, item => item.learningPath)
  items: LearningItem[];

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

}
