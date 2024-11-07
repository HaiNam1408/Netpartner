import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { ResponsesTicket } from "./responsesTicket";
import { EventEnum } from "../enum/Event.enum";
import { BroadCasts } from "./broadCasts";
import { BroadCastTicket } from "./boardCastTikect";


@Entity()
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type:"longtext" })
  content: string;

  @Column({ nullable: false, default:false })
  close: boolean;

  @ManyToOne(() => Users, user => user.ticket)
  @JoinColumn({ name: "userId" })
  user: Users;
  
  @Column({ nullable: false })
  userId: number;

  @OneToMany(() => ResponsesTicket, response => response.ticket)
  response: ResponsesTicket[];

  @Column({ type: 'enum', enum: EventEnum, nullable: false, default:EventEnum.PENDING})
  status: EventEnum;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

  @OneToMany(() => BroadCastTicket, broadCast => broadCast.ticket)
  broadCast: BroadCastTicket[];

}