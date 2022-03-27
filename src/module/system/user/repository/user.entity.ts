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
import { EUserType } from '../enum/user.enum';

@Entity({ name: 'user', synchronize: true })
@Index(['deletedAt', 'type', 'account'], { unique: true })
@Index(['deletedAt', 'type', 'phone'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'tinyint', default: EUserType.admin, comment: '类型' })
  type: EUserType;

  @Column({ type: 'tinyint', default: EStatus.enable, comment: '状态' })
  status: EStatus;

  @Column({ type: 'varchar', length: 15, nullable: false, comment: '密码' })
  password: string;

  @Column({ type: 'varchar', length: 11, nullable: false, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 11, nullable: false, comment: '账号' })
  account: string;

  @Column({ type: 'varchar', length: 11, default: null, comment: '名称' })
  name: string;

  @Column({ type: 'datetime', nullable: false, comment: '注册时间' })
  regAt: Date;

  @Column({ type: 'datetime', nullable: true, comment: '最后登录时间' })
  loginAt: Date;
}
