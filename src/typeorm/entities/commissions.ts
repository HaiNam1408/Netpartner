import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, Decimal128 } from "typeorm";
import { Branches } from "./branches";
import { Users } from "./users";
import { CommissionCrawlFrom } from "../enum/commission.enum";


@Entity()
export class Commissions {
  @PrimaryGeneratedColumn()
  id: number;  // STT (Index)

  // Trading ID
  @Column()
  trading_id: string;

  @Column({ nullable: true, length: 100 })
  user_manager: string

  // Đặt lệnh (Order)
  @Column({ nullable: true, length: 100 })
  order: string;

  // Tài khoản giao dịch (Trading Account)
  @Column({ nullable: true })
  tradingAccount: number;

  // IB
  @Column({ nullable: true })
  ib: number;

  // Thời gian (Time)
  @Column({ nullable: true, length: 100 })
  time: string;

  // Kiểu (Type)
  @Column({ nullable: true, length: 10 })
  type: string;

  // Rebate
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  rebate: number;

  // Ghi chú (Note)
  @Column({ nullable: true, length: 200 })
  note: string;

  // Level
  @Column({ nullable: true, length: 100 })
  level: string;

  // Đối tác (Partner)
  @Column({ nullable: true, length: 100 })
  partner: string;

  // Nguồn Crawl
  @Column({ type: 'enum', enum: CommissionCrawlFrom, nullable: true })
  crawlFrom: CommissionCrawlFrom;

  // Thời gian tạo (Creation Time)
  @CreateDateColumn({ nullable: true })
  create_at: Date;

  // Thời gian cập nhật (Update Time)
  @Column({ nullable: true })
  update_at: Date;

  @Column({ nullable: true, type: 'decimal' })
  profit: number
}