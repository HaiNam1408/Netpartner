import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CommissionCrawlFrom } from "../enum/commission.enum";

@Entity('registered_customer')
export class RegisteredCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  connect_id: number;

  @Column({ nullable: true, length: 45 })
  user_manager: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true, length: 45 })
  tradeLoginId: string;

  @Column({ nullable: true })
  commissionId: number;

  @Column({ nullable: true })
  commissionName: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  surName: string;

  @Column({ nullable: true })
  surNameEN: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  lastNameEN: string;

  @Column({ nullable: true })
  midNameEN: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, length: 10 })
  phoneCtCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, length: 1 })
  rating: string;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  balance: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  equity: number;

  @Column({ nullable: true })
  credit: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  marginfree: number;

  @Column({ nullable: true })
  parentTradeLoginId: number;

  @Column({ nullable: true })
  parentDisplayName: string;

  @Column({ nullable: true })
  mgrTradeLoginId: number;

  @Column({ nullable: true })
  mgrDisplayName: string;

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  accountLevel: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  permitInvite: boolean;

  @Column({ type: 'datetime', nullable: true })
  createTradeAccountTime: Date;

  @Column({ type: 'datetime', nullable: true })
  approveTime: Date;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  createTime: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updateTime: Date;

  @Column({ nullable: true, length: 3 })
  currency: string;

  @Column({ nullable: true })
  accountType: number;

  @Column({ type: 'datetime', nullable: true })
  activateTime: Date;

  @Column({ nullable: true })
  subAccount: boolean;

  @Column({ nullable: true })
  lastFollowContent: string;

  @Column({ type: 'datetime', nullable: true })
  lastFollowTime: Date;

  @Column({ nullable: true })
  accStatus: number;

  @Column({ nullable: true })
  groupId: number;

  @Column({ nullable: true })
  sourceCode: string;

  @Column({ nullable: true })
  sourceCodeDisplay: string;

  @Column({ nullable: true })
  intentionTypeCode: string;

  @Column({ nullable: true })
  platform: number;

  @Column({ nullable: true })
  remark: string;

  @Column({ nullable: true })
  mgrDepartmentName: string;

  @Column({ type: 'datetime', nullable: true })
  firstDepositTime: Date;

  @Column({ nullable: true })
  companyId: number;

  @Column({ nullable: true })
  inviteCode: string;

  @Column({ nullable: true })
  inviteUrlId: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  bailRate: number;

  @Column({ nullable: true })
  leader: boolean;

  @Column({ nullable: true })
  interestFree: number;

  @Column({ nullable: true })
  ownLinkClonePermissions: number;

  @Column({ nullable: true })
  nextLevelLinkClonePermissions: number;

  @Column({ nullable: true })
  englishName: string;

  @Column({ nullable: true })
  cnname: string;

  @Column({ nullable: true })
  accountTypeDisplay: string;

  @Column({ nullable: true })
  accStatusDisplay: string;

  @Column({ nullable: true })
  accountStatusDisplay: string;

  @Column({ nullable: true })
  displayPhone: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ type: 'enum', enum: CommissionCrawlFrom, nullable: true})
  CrawlFrom: CommissionCrawlFrom;
}