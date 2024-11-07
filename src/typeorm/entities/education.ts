import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users';
import { PlayList } from './playList';
import { Category } from './categories';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, type: 'longtext' })
  content: string;

  @Column({ nullable: true, length: 300 })
  attachment: string;

  @Column({ nullable: true, length: 300 })
  cover: string;

  @ManyToOne(() => Users, (user) => user.education)
  @JoinColumn({ name: 'authorId' })
  user: Users;

  @Column({ nullable: false })
  authorId: number;

  @ManyToOne(() => Category, (category) => category.education)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => PlayList, (playlist) => playlist.education)
  @JoinColumn({ name: 'playListId' })
  playlist: PlayList;

  @Column({ nullable: true })
  playListId: number;

  @Column({ nullable: true })
  pinned: number;

  @Column({ nullable: true, default: 0 })
  views: number;

  @Column({ nullable: true })
  @CreateDateColumn()
  create_at: Date;

  @Column({ nullable: true })
  update_at: Date;
}
