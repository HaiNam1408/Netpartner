import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CommissionCrawlFrom } from "../enum/commission.enum";

@Entity()
export class DepositedCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  // Trading ID
  @Column()
  trading_id: string;

  // Đặt lệnh (Order)
  @Column({ nullable: true })
  orderId: string;

  // Số seri (Serial Number)
  @Column({ nullable: true })
  serialNumber: string;

  // Loại (Type)
  @Column({ nullable: true })
  type: string;

  // Tiền tệ (Currency)
  @Column({ nullable: true, length: 10 })
  currency: string;

  // Email
  @Column({ nullable: true })
  email: string;

  // Tài khoản đăng nhập (Login Account)
  @Column({ nullable: true, length: 45 })
  tradeLoginId: string;

  // Tên (Name)
  @Column({ nullable: true })
  name: string;

  // Nền tảng (Platform)
  @Column({ nullable: true })
  platform: number;

  // Thời gian tạo (Creation Time)
  @CreateDateColumn({ nullable: true })
  createTradeAccountTime: Date;

  // Loại giao dịch (Transaction Type)
  @Column({ nullable: true })
  transactionType: string;

  // Cách (Method)
  @Column({ nullable: true })
  method: string;

  // Ghi chú (Note)
  @Column({ nullable: true })
  remark: string;

  // Giá trị (Value)
  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  value: number;

  // Hiện trạng (Status)
  @Column({ nullable: true })
  status: string;

  // IB Cấp trên (Superior IB)
  @Column({ nullable: true })
  parentIB: string;
  
  // In
  @Column({ default: 0 })
  in: number;
  
  // Out
  @Column({ default: 0 })
  out: number;
}