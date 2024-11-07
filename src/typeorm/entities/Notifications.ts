import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BroadCasts } from './broadCasts';
import { Users } from './users';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type: 'longtext' })
  content: string;

  @Column({ nullable: false })
  cover: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

  @OneToMany(() => BroadCasts, (broadCast) => broadCast.notification)
  broadCast: BroadCasts[];

  @ManyToOne(() => Users, (user) => user.notification)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ nullable: true })
  userId: number;
}
