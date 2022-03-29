import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permission', synchronize: false })
@Index(['operationId'], { unique: true })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '权限点后端唯一标识',
  })
  operationId: string;

  @Column({ type: 'varchar', length: 20, nullable: false, comment: '名称' })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '前端页面模块和菜单有个映射关系',
  })
  module: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '前端页面动作',
  })
  action: string;
}
