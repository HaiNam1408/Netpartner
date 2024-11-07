import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommissionCrawlFrom } from "../enum/commission.enum";

@Entity()
export class OrderHistoryCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  // Trading ID
  @Column()
  trading_id: string;

  // Nhân viên sale
  @Column({ nullable: true, length: 45 })
  user_manager: string;

  // Tài khoản giao dịch
  @Column({ nullable: true, length: 45 })
  login: string;

  // Lots
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  volume: number;

  // Giờ mở cửa
  @Column({ nullable: true })
  openTime: string;

  // Giá mở cửa
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  openPrice: number;

  // S/L
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  sl: number;

  // T/P
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  tp: number;

  // Giờ đóng cửa
  @Column({ nullable: true })
  closeTime: string;

  // Tiền chiết khấu
  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  commission: number;

  // Swaps
  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  swaps: number;

  // Giá đóng cửa
  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  closePrice: number;

  // Closed P/L
  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  profit: number;

  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  taxes: number;

  // Tiền tệ
  @Column({ nullable: true, length: 3 })
  currency: string;

  // Sản phẩm
  @Column({ nullable: true, length: 20 })
  product: string;

  // Loại tài khoản
  @Column({ nullable: true })
  accountType: string;

  // Loại giao dịch
  @Column({ nullable: true })
  tradingType: number;

  // IB cấp trên
  @Column({ nullable: true })
  agent: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  mgrDisplayName: string;

  // Nguồn Crawl
  @Column({ type: 'enum', enum: CommissionCrawlFrom, nullable: true })
  CrawlFrom: CommissionCrawlFrom;
}