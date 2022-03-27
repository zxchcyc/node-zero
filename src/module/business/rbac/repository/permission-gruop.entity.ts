import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permission_group', synchronize: true })
@Index(['code'], { unique: true })
export class PermissionGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '权限包顺序' })
  seq: number;

  @Column({ type: 'int', nullable: true, comment: '权限包种类顺序' })
  seqKind: number;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '名称' })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '编码' })
  code: string;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '种类' })
  kind: string;
}
