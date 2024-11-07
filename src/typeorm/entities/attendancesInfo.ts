import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Attendance_info {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    attendance_code: string;

    @Column({ nullable: true })
    stt: number;

    @Column({ nullable: true })
    employeeName: string;

    @Column({ nullable: true })
    dayWorkNormal: number;

    @Column({ nullable: true })
    dayWorkOverTime: number;

    @Column({ nullable: true })
    hourWorkNormal: number;

    @Column({ nullable: true })
    hourWorkOverTime: number;

    @Column({ nullable: true })
    countDelay: number;

    @Column({ nullable: true })
    minutesDelayTime: number;

    @Column({ nullable: true })
    countEarly: number;

    @Column({ nullable: true })
    minutesEarlyTime: number;

    @Column({ nullable: true })
    tc1: number;

    @Column({ nullable: true })
    tc2: number;

    @Column({ nullable: true })
    tc3: number;

    @Column({ nullable: true })
    absenceWithoutPermission: number;

    @Column({ nullable: true })
    om: number;

    @Column({ nullable: true })
    ts: number;

    @Column({ nullable: true })
    r: number;

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;
}