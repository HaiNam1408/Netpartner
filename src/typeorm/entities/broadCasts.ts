import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./users";
import { Notifications } from "./Notifications";

@Entity()
export class BroadCasts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default:false })
  read: boolean;

  @ManyToOne(() => Users, (user) => user.broadCast)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @ManyToOne(() => Notifications, (notification) => notification.broadCast)
  @JoinColumn({ name: 'notificationId' })
  notification: Notifications;

  @Column({nullable:true})
  notificationId: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}