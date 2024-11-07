import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { typeSupport } from "../enum/typeSupport.enum";
import { statusSupport } from "../enum/statusSupport.enum";
import { coreValue } from "../enum/coreValue.enum";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type:"longtext" })
  content: string;

  @Column({ nullable: true, type:"text" })
  attachment: string;

  @Column({ type: 'enum', enum: coreValue, nullable: false})
  type: coreValue;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}