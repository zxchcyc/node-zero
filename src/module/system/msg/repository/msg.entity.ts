import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMsgStatus, EMsgTag, EReadStatus } from '../enum/msg.enum';

@Entity({ name: 'msg', synchronize: false })
@Index(['msgid'])
export class MsgEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'tinyint', default: EMsgStatus.enable, comment: '状态' })
  status: EMsgStatus;

  @Column({ type: 'tinyint', nullable: false, comment: '消息标签' })
  tag: EMsgTag;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '消息标题',
  })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '消息内容' })
  content: string;

  @Column({ type: 'int', nullable: false, comment: '用户id' })
  uid: number;

  @Column({ type: 'tinyint', default: EReadStatus.undone, comment: '是否已读' })
  read: EReadStatus;

  @Column({
    type: 'text',
    nullable: true,
    comment: '消息落地需要的参数放这里面',
  })
  attached: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '消息ID' })
  msgid: string;
}
