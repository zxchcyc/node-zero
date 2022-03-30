import { EStatus } from 'src/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'dict', synchronize: false })
@Index(['deletedAt', 'type', 'key'], { unique: true })
export class DictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'tinyint', default: EStatus.enable, comment: '状态' })
  status: EStatus;

  @Column({ type: 'varchar', length: 50, default: null, comment: '字典类型' })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '字典键' })
  key: string;

  @Column({ type: 'tinyint', nullable: false, comment: '字典值' })
  value: number;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '中文简体' })
  textZhHans: string;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '中文繁体' })
  textZhHant: string;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '英文' })
  textEn: string;

  @Column({ type: 'int', nullable: false, default: 0, comment: '序号' })
  sort: number;
}
