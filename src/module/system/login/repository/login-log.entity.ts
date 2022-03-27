import {
  ELoginDesc,
  ELoginStatus,
  ELoginTerminal,
  ELoginWay,
  ELoginWebSite,
  ESystem,
} from 'src/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'login_log', synchronize: true })
@Index(['uid'])
export class LoginLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: 'ip' })
  ip: string;

  @Column({ type: 'datetime', nullable: true, comment: '登录时间' })
  loginAt: Date;

  @Column({ type: 'int', nullable: true, comment: '用户id' })
  uid: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '登录站点',
  })
  webSite: ELoginWebSite;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '登录终端',
  })
  terminal: ELoginTerminal;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '登录方式',
  })
  way: ELoginWay;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '登录状态',
  })
  status: ELoginStatus;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '状态说明',
  })
  desc: ELoginDesc;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: '登录系统',
  })
  system: ESystem;
}
