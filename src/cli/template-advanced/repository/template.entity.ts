import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ETemplateStatus, ETemplateType } from '../enum/template.enum';

@Entity({ name: 'template', synchronize: false })
@Index(['deletedAt', 'type', 'title'])
export class TemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'tinyint', default: null, comment: '类型' })
  type: ETemplateType;

  @Column({ type: 'tinyint', default: ETemplateStatus.done, comment: '状态' })
  status: ETemplateStatus;

  @Column({ type: 'datetime', nullable: true, comment: '发布时间' })
  pubAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '标题' })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '封面' })
  cover: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '视频' })
  video: string;

  @Column({ type: 'text', nullable: false, comment: '文章内容' })
  content: string;

  @Column({ type: 'tinyint', default: 1, comment: '是否结束' })
  finish: number;

  @Column({ type: 'int', nullable: false, default: 0, comment: '序号' })
  sort: number;

  @Column({ type: 'tinyint', nullable: false, default: 0, comment: '是否置顶' })
  isTop: number;
}
