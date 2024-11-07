import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Education } from "./education";
import { Video } from "./videoYtb";
import { TypeEducation } from "../enum/typeEdu";

@Entity()
export class PlayList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;

  @OneToMany(() => Education, education => education.playlist)
  education: Education[];

  @OneToMany(() => Video, education => education.playlist)
  video: Video[];

  @Column({ type: 'varchar', length: 255, nullable: false, default:TypeEducation.POST })
  type: TypeEducation;
}