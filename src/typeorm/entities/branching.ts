import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Branches } from "./branches";
import { Users } from "./users";


@Entity()
export class Branching {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.branching)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @ManyToOne(() => Branches, (branch) => branch.branchings)
  branch: Branches;

  @Column({nullable:true})
  branchId: number;

  @Column({ nullable: true })
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}