import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
} from 'typeorm';

@Entity({ name: 'region', synchronize: true })
@Index(['name'])
@Index(['code'],{ unique: true })
@Index(['pCode'])
export class RegionEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '行政区域编码',
    primary: true,
  })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '行政区域名字',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '行政区域上级编码',
  })
  pCode: string;

  @Column({ type: 'int', nullable: false, comment: '行政区域深度' })
  level: number;

  @Column({ type: 'varchar', nullable: false, comment: '行政区域编码链' })
  chain: string;
}
