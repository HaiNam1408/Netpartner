import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommissionCrawlFrom } from '../enum/commission.enum';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  trading_id: string;

  @Column({ nullable: true, length: 100 })
  fullname: string;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 100 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  date_of_birth: string;

  @Column({ nullable: true, length: 100 })
  tag: string;

  @Column({ nullable: true, length: 100 })
  saler: string;

  @Column({ nullable: true, length: 100 })
  leader: string;

  @Column({ nullable: true, length: 100 })
  maketer: string;

  @Column({ type: 'enum', enum: CommissionCrawlFrom, nullable: true })
  CrawlFrom: CommissionCrawlFrom;

  @Column({ nullable: true })
  flag_time: Date;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @Column({ nullable: true, default: 0, type:'double' })
  lot: number;

  @Column({ nullable: true, default: 0, type:'double' })
  net_dep: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true, default:false })
  isExamine:Boolean

  @Column({ nullable: true })
  @CreateDateColumn()
  @Column({ nullable: true })
  update_at: Date;
}
