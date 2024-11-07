import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { Tickets } from "./tickets";


@Entity()
export class ResponsesTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 100 })
  title: string;

  @Column({ nullable: true, type:"text" })
  content: string;

  @ManyToOne(() => Users, user => user.response)
  @JoinColumn({ name: "authorId" })
  user: Users;
  
  @Column({ nullable: true })
  authorId: number;

  @ManyToOne(() => Tickets, ticket => ticket.response, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "ticketId" })
  ticket: Tickets;
  
  @Column({ nullable: true })
  ticketId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

}