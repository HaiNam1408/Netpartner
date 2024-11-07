import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { typeSupport } from "../enum/typeSupport.enum";
import { statusSupport } from "../enum/statusSupport.enum";

@Entity()
export class Support {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type:"longtext" })
  content: string;

  @Column({ nullable: true, length: 300 })
  cover: string;

  @Column({ nullable: true, type:"text" })
  attachment: string;

  @ManyToOne(() => Users, user => user.supports)
  @JoinColumn({ name: "authorId" })
  user: Users;
  
  @Column({ nullable: false })
  authorId: number;

  @Column({ type: 'enum', enum: typeSupport, nullable: false})
  type: typeSupport;

  @Column({ type: 'enum', enum: statusSupport, nullable: false,default:statusSupport.DOI_TIEP_NHAN})
  status: statusSupport;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}