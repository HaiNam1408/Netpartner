import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class Infomation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type:"longtext"})
  content: string;

  @Column({ nullable: true, length: 300 })
  attachment: string;

  @Column({ nullable: true, length: 300 })
  cover: string;

  @ManyToOne(() => Users, user => user.infomation)
  @JoinColumn({ name: "authorId" })
  user: Users;
  
  @Column({ nullable: false })
  authorId: number;

  @Column({ nullable: true, default:0 })
  views: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}