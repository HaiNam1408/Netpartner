import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { TypeMedia } from "../enum/typeMedia";
import { Department } from "./department";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 500 })
  title: string;

  @Column({ nullable: true, type:"longtext" })
  content: string;

  @Column({ nullable: true,type:"text" })
  link: string;

  @Column({ nullable: true })
  views:number

  @ManyToOne(() => Users, user => user.media)
  @JoinColumn({ name: "authorId" })
  user: Users;

  @ManyToOne(() => Department, (department) => department.media)
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  departmentId: number;

  @Column()
  authorId: number

  @Column({ type: 'enum', enum: TypeMedia, nullable: false})
  type: TypeMedia;

  @Column({default: false})
  isPinned: Boolean

  @Column({ nullable: true })
  pinnedPosition: number

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}