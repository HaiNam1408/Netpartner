import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Attendance_code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  attendance_code: string;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true})
  time: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}