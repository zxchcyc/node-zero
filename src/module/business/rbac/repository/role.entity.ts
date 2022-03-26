import { EStatus } from 'src/common';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role', synchronize: true })
@Index(['code'], { unique: true })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '名称' })
  name: string;

  @Column({ type: 'tinyint', nullable: false, comment: '状态' })
  status: EStatus;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: '编码' })
  code: string;
}
