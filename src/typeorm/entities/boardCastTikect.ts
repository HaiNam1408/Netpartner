import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { Tickets } from "./tickets";

@Entity()
export class BroadCastTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default:false })
  read: boolean;

  @ManyToOne(() => Users, (user) => user.broadCast)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @ManyToOne(() => Tickets, (ticket) => ticket.broadCast)
  @JoinColumn({ name: 'ticketId' })
  ticket: Tickets;

  @Column({nullable:true})
  ticketId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}