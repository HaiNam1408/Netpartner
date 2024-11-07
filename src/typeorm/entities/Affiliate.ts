import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { AffiliateType } from "../enum/Affiliate.enum";
import { Users } from "./users";

@Entity()
export class Affiliate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 200 })
  title: string;

  @Column({ nullable: false, type:"text" })
  link: string;

  @Column({ type: 'enum', enum: AffiliateType, nullable: false})
  type: AffiliateType;

  @Column({ default: 0 })
  total_usage: number;

  @ManyToOne(() => Users, user => user.affiliate)
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