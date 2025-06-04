import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Url } from '../url/url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  clickedAt: Date;

  @Column()
  ipAddress: string;

  @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
  url: Url;
}
