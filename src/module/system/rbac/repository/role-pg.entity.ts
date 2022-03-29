import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role_pg', synchronize: false })
@Index(['rid', 'pgid'], { unique: true })
export class RolePgEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, comment: '角色id' })
  rid: number;

  @Column({ type: 'int', nullable: false, comment: '权限包id' })
  pgid: number;
}
