import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Education } from "./education";
import { Users } from "./users";

@Entity()
export class UserOnline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  time: number;

  @ManyToOne(() => Users, user => user.user_online)
  @JoinColumn({ name: "userId" })
  user: Users;
  
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

}