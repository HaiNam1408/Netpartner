import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Users } from "./users";
import { Media } from "./media";
import { LearningPath } from "./learing-path";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  name: string;

  @Column({ nullable: false, length: 100 })
  code: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
  
  @OneToMany(() => Users, (user) => user.department)
  users: Users[];

  @OneToMany(() => Media, (user) => user.department)
  media: Media[];

  @OneToMany(() => LearningPath, (user) => user.department)
  learningPath: LearningPath[];
}