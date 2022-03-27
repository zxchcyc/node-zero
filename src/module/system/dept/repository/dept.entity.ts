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

@Entity({ name: 'dept', synchronize: true })
@Index(['deletedAt', 'chain'])
@Index(['deletedAt', 'pid'])
@Index(['deletedAt', 'code'], { unique: true })
export class DeptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '部门名字' })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '部门编码' })
  code: string;

  @Column({ type: 'int', nullable: false, comment: '上级部门ID' })
  pid: number;

  @Column({ type: 'varchar', nullable: false, comment: '部门ID链' })
  chain: string;

  @Column({ type: 'int', nullable: false, comment: '部门深度' })
  level: number;

  @Column({ type: 'tinyint', default: EStatus.enable, comment: '状态' })
  status: EStatus;
}
